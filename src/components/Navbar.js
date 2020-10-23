import React, { useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import NotificationsIcon from "@material-ui/icons/Notifications"; //認証してない友達
import Badge from "@material-ui/core/Badge"; //上のiconにつく数字
import { FiLogOut } from "react-icons/fi"; //logoutボタン
import { withCookies } from "react-cookie"; //cookieへアクセスしtokenを削除

//materialuiの定義
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#33c9dc",
    color: "black",
  },
  bg: {
    marginRight: theme.spacing(1),
  },
  title: {
    //全体に対して幅の占める割合
    flexGrow: 1,
  },
}));

const Navbar = (props) => {
  const classes = useStyles(); //必須
  const { askList, profiles } = useContext(ApiContext);
  const Logout = () => (event) => {
    //cookieに残っているtokenを削除する
    props.cookies.remove("current-token");
    //logout後にlogin画面に遷移
    window.location.href = "/";
  };
  return (
    // navigation全体
    <AppBar position="static" className={classes.root}>
      {/* ツールバー内に記載 */}
      <Toolbar>
        <Typography variant="h4" className={classes.title}>
          Favo Load Bike
        </Typography>
        <Badge
          className={classes.bg}
          badgeContent={
            askList.filter((ask) => {
              return (
                ask.approved === false &&
                profiles.filter((item) => {
                  return item.userPro === ask.askFrom;
                })[0]
              );
            }).length
          }
          color="secondary"
        >
          <NotificationsIcon />
        </Badge>
        <button className="signOut" onClick={Logout()}>
          <FiLogOut />
        </button>
      </Toolbar>
    </AppBar>
  );
};

export default withCookies(Navbar);
