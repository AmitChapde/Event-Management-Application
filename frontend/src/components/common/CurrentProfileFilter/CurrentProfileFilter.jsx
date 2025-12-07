import React, { useEffect, useState } from "react";
import styles from "./CurrentProfileFilter.module.css";
import { ChevronsUpDown, Check } from "lucide-react";
import { useProfiles } from "../../../contexts/ProfilesContext";

function CurrentProfileFilter({ onSelect }) {
  const { profiles, addProfile } = useProfiles();
  const [showList, setShowList] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [newName, setNewName] = useState("");
  const [isAddingProfile, setIsAddingProfile] = useState(false);

  useEffect(() => {
    setFiltered(profiles || []);
  }, [profiles]);

  const handleSearch = (value) => {
    setSearchText(value);

    if (!value) {
      setFiltered(profiles);
      return;
    }

    const results = (profiles || []).filter((p) =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(results);
  };

  const chooseProfile = (p) => {
    setSelected(p);
    setShowList(false);
    if (onSelect) onSelect(p._id);
  };

  const handleAddProfile = async () => {
    const name = newName.trim();
    if (!name) return;

    setIsAddingProfile(true);
    try {
      const created = await addProfile({ name });
      if (created) {
        setSelected(created);
        if (onSelect) onSelect(created._id);
      }
      setNewName("");
    } catch (err) {
      console.error("Error adding profile", err);
    } finally {
      setIsAddingProfile(false);
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.inputBox}
        onClick={() => setShowList((prev) => !prev)}
      >
        <p className={styles.subContainer}>
          {selected ? selected.name : "Search Profile..."}{" "}
          <ChevronsUpDown size={15} />
        </p>
      </div>

      {showList && (
        <div className={styles.modal}>
          <input
            type="search"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search current profile..."
            className={styles.search}
          />

          <div className={styles.profileList}>
            {filtered.length ? (
              filtered.map((p) => (
                <div
                  key={p._id}
                  className={`${styles.profileItem} ${
                    selected?._id === p._id ? styles.selected : ""
                  }`}
                  onClick={() => chooseProfile(p)}
                >
                  <div className={styles.selctionContainer}>
                    {selected?._id === p._id && (
                      <Check size={18} className={styles.checkIcon} />
                    )}
                    <span>{p.name}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No profiles found</p>
            )}
          </div>

          <div className={styles.addSection}>
            <input
              type="text"
              className={styles.addInput}
              placeholder="Add profile..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
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

export default CurrentProfileFilter;
