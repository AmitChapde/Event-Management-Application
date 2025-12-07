import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ProfileSelector.module.css";
import { getAllProfiles, createProfile } from "../../../api/profileApi";
import { ChevronsUpDown, Check } from "lucide-react";

function ProfileSelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [allProfiles, setAllProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [newProfileName, setNewProfileName] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await getAllProfiles();
        setAllProfiles(Array.isArray(response?.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to load profiles", error);
      }
    })();
  }, []);

 
  useEffect(() => {
    if (Array.isArray(value)) {
      setSelectedProfiles(value);
    } else {
      setSelectedProfiles([]);
    }
  }, [value]);

 
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const filteredProfiles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allProfiles;
    return allProfiles.filter((p) => p.name?.toLowerCase().includes(q));
  }, [allProfiles, searchQuery]);

  
  const toggleProfile = (profile) => {
    const isSelected = selectedProfiles.some((p) => p._id === profile._id);
    const updated = isSelected
      ? selectedProfiles.filter((p) => p._id !== profile._id)
      : [...selectedProfiles, profile];

    setSelectedProfiles(updated);
    onChange?.(updated);
  };

 
  const handleAddProfile = async () => {
    const name = newProfileName.trim();
    if (!name) return;

    try {
      const response = await createProfile({ name });
      const newProfile = response?.data;
      if (newProfile?._id) {
        setAllProfiles((prev) => [...prev, newProfile]);
        setNewProfileName("");
      }
    } catch (error) {
      console.error("Could not add profile", error);
    }
  };


  const headerText = () => {
    if (!selectedProfiles?.length) return "Select profile...";
    return `${selectedProfiles.length} profiles selected`;
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <div className={styles.headerBox} onClick={() => setIsOpen((o) => !o)}>
        <p className={styles.headerContent}>
          {headerText()}
          <ChevronsUpDown size={15} />
        </p>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <input
            type="search"
            className={styles.searchField}
            placeholder="Search profiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className={styles.profileList}>
            {filteredProfiles.length ? (
              filteredProfiles.map((profile) => {
                const isSelected = selectedProfiles.some(
                  (p) => p._id === profile._id
                );
                return (
                  <div
                    key={profile._id}
                    className={`${styles.profileItem} ${
                      isSelected ? styles.selected : ""
                    }`}
                    onClick={() => toggleProfile(profile)}
                  >
                    <div className={styles.row}>
                      {isSelected && <Check size={18} />}
                      <span>{profile.name}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className={styles.noData}>No profiles found</p>
            )}
          </div>

          <div className={styles.addRow}>
            <input
              type="text"
              className={styles.addInput}
              placeholder="Add profile..."
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
            />
            <button className={styles.addBtn} onClick={handleAddProfile}>
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileSelector;
