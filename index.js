(function () {
  if (!window.indexedDB) {
    console.log("your browser doesnot support indexdb");
    return;
  }
})();

const request = indexedDB.open("CRM", 1);

request.onerror = (e) => {
  console.log(e.target.errorCode);
};

request.onsuccess = (e) => {
  const db = e.target.result;

  //   deleteContact(db, 1);

  getAllContact(db);

  //   getContactById(db, 3);

  //   getContactByEmail(db, "afshal@gmail.com");

  //   insertContact(db, {
  //     email: "imthiyas@gmail.com",
  //     firstName: "imthiyas",
  //     lastname: "mohamed",
  //   });
  //   insertContact(db, {
  //     email: "afshal@gmail.com",
  //     firstName: "afshal",
  //     lastname: "mohamed",
  //   });

  console.log("success", e);
};

// craete object

request.onupgradeneeded = (e) => {
  let db = e.target.result;

  let store = db.createObjectStore("Contacts", {
    autoIncrement: true,
  });

  let index = store.createIndex("email", "email", {
    unique: true,
  });
};

function insertContact(db, contact) {
  const txn = db.transaction("Contacts", "readwrite");

  const store = txn.objectStore("Contacts");

  let query = store.put(contact);

  query.onsuccess = (e) => {
    console.log(e);
  };
  query.onerror = (e) => {
    console.log("ERROR", e.target.errorCode);
  };

  txn.oncomplete = () => {
    db.close();
  };
}

function getContactById(db, id) {
  const txn = db.transaction("Contacts", "readonly");

  const store = txn.objectStore("Contacts");

  let query = store.get(id);

  query.onsuccess = (e) => {
    if (!e.target.result) {
      console.log(`The contact with ${id} not found`);
    } else {
      console.log(e.target.result);
    }
  };

  query.onerror = (event) => {
    console.log(event.target.errorCode);
  };

  txn.oncomplete = function () {
    db.close();
  };
}

function getContactByEmail(db, email) {
  const txn = db.transaction("Contacts", "readonly");

  const store = txn.objectStore("Contacts");

  const index = store.index("email");

  console.log("INDEX", index);

  let query = index.get(email);

  query.onsuccess = (event) => {
    console.log(query.result);
  };

  query.onerror = (event) => {
    console.log(event.target.errorCode);
  };

  // close the database connection
  txn.oncomplete = function () {
    db.close();
  };
}

function getAllContact(db) {
  const txn = db.transaction("Contacts", "readonly");

  const objectStore = txn.objectStore("Contacts");

  objectStore.getAll().onsuccess = (e) => {
    let cursor = e.target.result;

    if (cursor) {
      let info = [];
      let contact = cursor;

      info = [...info, contact];

      console.log(info);

      //   cursor.continue();
    }
  };

  txn.oncomplete = function () {
    db.close();
  };
  //   const txn = db.transaction("Contacts", "readonly");

  //   const objectStore = txn.objectStore("Contacts");

  //   objectStore.getAll().onsuccess = (e) => {
  //     let cursor = e.target.result;

  //     if (cursor) {
  //       let info = [];
  //       let contact = cursor.value;

  //       info = [...info, contact];

  //       console.log(info);

  //       cursor.continue();
  //     }
  //   };

  //   txn.oncomplete = function () {
  //     db.close();
  //   };
}

function deleteContact(db, id) {
  const txn = db.transaction("Contacts", "readwrite");

  const store = txn.objectStore("Contacts");

  let query = store.delete(id);

  query.onsuccess = function (event) {
    console.log(event);
  };

  query.onerror = function (event) {
    console.log(event.target.errorCode);
  };

  txn.oncomplete = function () {
    db.close();
  };
}
