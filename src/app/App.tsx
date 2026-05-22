import { Outlet } from "react-router";
import Navigation from "../components/navigation/Navigation";
import classes from "./App.module.css";

function App() {
  return (
    <>
      <Navigation />
      <main className={classes.main}>
        <div className={classes.content}>
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default App;
