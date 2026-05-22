import { Link } from "react-router";
import logo from "../../assets/logo.svg";
import classes from "./Navigation.module.css";

function Navigation() {
  return (
    <nav className={classes.nav}>
      <div className={classes.navInner}>
        <Link to="/">
          <div className={classes.logo}>
            <img src={logo} className={classes.logoImage} alt="logo" />
            <span className={classes.logoText}>Globe Quiz</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;
