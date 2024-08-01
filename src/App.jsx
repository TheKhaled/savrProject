import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import NavBar from "./Compents/NavBar";
import Posts from "./Compents/Posts";
import { Route, Routes } from "react-router-dom";
import CreatPost from "./Compents/pages/CreatPost";
import Login from "./Compents/pages/login";
import { auth, db } from "./config/firebase";
import { collection, getDocs } from "firebase/firestore";

function App() {
  const [items, setItems] = useState([]);

  const factoirsColloiction = collection(db, "factories");
  useEffect(() => {
    const getPostes = async () => {
      //  to read
      try {
        const data = await getDocs(factoirsColloiction);
        const cleanResData = data.docs.map((ele) => ({
          ...ele.data(),
          id: ele.id,
        }));

        setItems(cleanResData);
      } catch (error) {
        console.log(error);
      }
    };

    getPostes();
  }, []);

  // const HandelDataAfterPosr = (newProdctus) => {
  //   const newItems = [...items, newProdctus];
  //   setItems(newItems);
  // };
  const HandelDataAfterPosr = (newProdctus) => {
    // Check if the product already exists
    const existingItemIndex = items.findIndex(
      (item) => item.id === newProdctus.id
    );
    if (existingItemIndex === -1) {
      // If it's a new post, add it
      setItems((prevItems) => [...prevItems, newProdctus]);
    } else {
      // If it's an update, replace the old item
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === newProdctus.id ? newProdctus : item
        )
      );
    }
  };
  const handelRemove = (toRemove) => {
    let newItems = [...items];
    newItems = newItems.filter((item) => item.id !== toRemove.id);
    setItems(newItems);
  };

  // const HandeAfterEdit = (toEditeItem) => {
  //   const newItems = [...items];
  //   const index = newItems.findIndex((i) => i.id == toEditeItem.id);
  //   newItems[index] = toEditeItem;
  //   setItems(newItems);
  // };

  const HandeAfterEdit = (toEditeItem) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === toEditeItem.id ? toEditeItem : item))
    );
  };

  return (
    <div>
      <NavBar></NavBar>
      <Routes>
        <Route
          path="/"
          element={<Posts items={items} handelRemove={handelRemove}></Posts>}
        />
        <Route
          path="/creatPost/:id"
          element={
            <CreatPost
              items={items}
              HandelDataAfterPosr={HandelDataAfterPosr}
              factoirsColloiction={factoirsColloiction}
              HandeAfterEdit={HandeAfterEdit}
            ></CreatPost>
          }
        />
        <Route path="/login" element={<Login></Login>} />
      </Routes>
    </div>
  );
}

export default App;
