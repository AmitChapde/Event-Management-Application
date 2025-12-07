import React, { useEffect, useState } from "react";
import styles from "./CurrentProfileFilter.module.css";
import { getAllProfiles, createProfile } from "../../../api/profileApi";
import { ChevronsUpDown, Check } from "lucide-react";

function CurrentProfileFilter({onSelect}) {
  const [showList, setShowList] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllProfiles();
        setProfiles(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.log("Failed loading profiles", err);
      }
    })();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);

    if (!value) {
      setFiltered(profiles);
      return;
    }

    const results = profiles.filter((p) =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(results);
  };

  const chooseProfile = (p) => {
    setSelected(p);
    setShowList(false);
    if (onSelect) onSelect(p._id);
  };

  const addProfile = async () => {
    if (!newName.trim()) return;

    try {
      const res = await createProfile({ name: newName });
      const updatedList = [...profiles, res.data];
      setProfiles(updatedList);
      setFiltered(updatedList);
      setNewName("");
    } catch (err) {
      console.log("Error adding profile", err);
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.inputBox}
        onClick={() => setShowList((prev) => !prev)}
      >
        <p className={styles.subContainer}>
          {selected ? selected.name : "Search Profile..."} <ChevronsUpDown size={15}/>
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
            />

            <button className={styles.addBtn} onClick={addProfile}>
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CurrentProfileFilter;
