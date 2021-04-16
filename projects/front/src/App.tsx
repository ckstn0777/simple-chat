import React, { useCallback, useEffect } from "react";
import "./App.css";

function App() {
  const onSuccess = useCallback((googleUser: any) => {
    (window as any).googleUser = googleUser;
    console.log(googleUser);
  }, []);
  const onFailure = useCallback((e: any) => {}, []);

  useEffect(() => {
    window.gapi?.signin2?.render("my-signin2", {
      scope: "profile email",
      width: 240,
      height: 50,
      longtitle: true,
      theme: "dark",
      onsuccess: onSuccess,
      onfailure: onFailure,
    });
  }, [onSuccess, onFailure]);

  return (
    <div className="App">
      <div id="my-signin2"></div>
    </div>
  );
}

export default App;
