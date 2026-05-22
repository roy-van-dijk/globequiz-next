import { Link } from "react-router";
import classes from "./Landing.module.css";

function Landing() {
  return (
    <div className={classes.landing}>
      <Link to="countries">Countries</Link>
    </div>
  );
}

export default Landing;
