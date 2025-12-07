import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ProfileSelector.module.css";
import { ChevronsUpDown, Check } from "lucide-react";
import { useProfiles } from "../../../contexts/ProfilesContext";

function ProfileSelector({ value, onChange }) {
  const { profiles, addProfile } = useProfiles();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [newProfileName, setNewProfileName] = useState("");
  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const dropdownRef = useRef(null);

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
    if (!q) return profiles || [];
    return (profiles || []).filter((p) => p.name?.toLowerCase().includes(q));
  }, [profiles, searchQuery]);

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

    setIsAddingProfile(true);
    try {
      const created = await addProfile({ name });
      if (created) {
        const newSelected = [...selectedProfiles, created];
        setSelectedProfiles(newSelected);
        onChange?.(newSelected);
        setNewProfileName("");
      }
    } catch (error) {
      console.error("Could not add profile", error);
    } finally {
      setIsAddingProfile(false);
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
              disabled={isAddingProfile}
            />
            <button
              className={styles.addBtn}
              onClick={handleAddProfile}
              disabled={isAddingProfile}
            >
              {isAddingProfile ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileSelector;
