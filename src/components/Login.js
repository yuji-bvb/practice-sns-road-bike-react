import React, { useReducer } from "react";
import { withCookies } from "react-cookie";
import axios from "axios"; //外部API
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress"; //load時に適用
import {
  START_FETCH,
  FETCH_SUCCESS,
  ERROR_CATCHED,
  INPUT_EDIT,
  TOGGLE_MODE,
} from "./actionTypes";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  span: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "teal",
    cursor: "pointer",
  },
  spanError: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "fuchsia",
    marginTop: 10,
  },
}));

//初期値の設定
const initialState = {
  isLoading: false, //ローディングされているかどうか
  isLoginView: true, //ログインとレジスターでの切り替え用
  error: "",
  credentialsLog: {
    username: "", //djangoのデフォルトの関係でemailでなくusernameになる
    password: "",
  },
  credentialsReg: {
    email: "",
    password: "",
  },
};

//場合わけ
const loginReducer = (state, action) => {
  switch (action.type) {
    case START_FETCH: {
      return {
        ...state, //部分的な更新のために一度展開する
        isLoading: true,
      };
    }
    case FETCH_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case ERROR_CATCHED: {
      return {
        ...state,
        error: "Email or password is not correct!",
        isLoading: false,
      };
    }
    case INPUT_EDIT: {
      return {
        ...state,
        [action.inputName]: action.payload,
        error: "",
      };
    }
    case TOGGLE_MODE: {
      return {
        ...state,
        isLoginView: !state.isLoginView,
      };
    }
    default:
      return state;
  }
};

//このpropsはcookieproviderを受け取るもの
const Login = (props) => {
  const classes = useStyles();
  //useReducerによりcompからdispatch可能に
  const [state, dispatch] = useReducer(loginReducer, initialState);

  const inputChangedLog = () => (event) => {
    const cred = state.credentialsLog;
    cred[event.target.name] = event.target.value;
    dispatch({
      type: INPUT_EDIT,
      inputName: "state.credentialsLog",
      payload: cred,
    });
  };

  const inputChangedReg = () => (event) => {
    const cred = state.credentialsReg;
    cred[event.target.name] = event.target.value;
    dispatch({
      type: INPUT_EDIT,
      inputName: "state.credentialsReg",
      payload: cred,
    });
  };

  //バックエンドのuserエンドポイントへアクセス
  //async,awaitでresが来るまで待つことだできる
  const login = async (event) => {
    event.preventDefault();
    //loginの時
    if (state.isLoginView) {
      try {
        dispatch({ type: START_FETCH });
        //第二引数に送るデータ
        const res = await axios.post(
          "http://127.0.0.1:8000/authen/",
          state.credentialsLog,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        //成功したらクッキーにトークンをセット
        props.cookies.set("current-token", res.data.token);
        res.data.token
          ? (window.location.href = "/profiles")
          : (window.location.href = "/");
        dispatch({ type: FETCH_SUCCESS });
      } catch {
        dispatch({ type: ERROR_CATCHED });
      }
    } else {
      //registerの時
      try {
        dispatch({ type: START_FETCH });
        await axios.post(
          "http://127.0.0.1:8000/api/user/create/",
          state.credentialsReg,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        dispatch({ type: FETCH_SUCCESS });
        dispatch({ type: TOGGLE_MODE });
      } catch {
        dispatch({ type: ERROR_CATCHED });
      }
    }
  };

  const toggleView = () => {
    dispatch({ type: TOGGLE_MODE });
  };

  return (
    <Container maxWidth="xs">
      <form onSubmit={login}>
        <div className={classes.paper}>
          {/* load時にくるくる回る */}
          {state.isLoading && <CircularProgress />}
          {/* 鍵マーク */}
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5">
            {state.isLoginView ? "Login" : "Register"}
          </Typography>

          {state.isLoginView ? (
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Email"
              name="username"
              value={state.credentialsLog.username}
              onChange={inputChangedLog()}
              autoFocus
            />
          ) : (
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Email"
              name="email"
              value={state.credentialsReg.email}
              onChange={inputChangedReg()}
              autoFocus
            />
          )}

          {state.isLoginView ? (
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={state.credentialsLog.password}
              onChange={inputChangedLog()}
            />
          ) : (
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={state.credentialsReg.password}
              onChange={inputChangedReg()}
            />
          )}
          <span className={classes.spanError}>{state.error}</span>
          {state.isLoginView ? (
            !state.credentialsLog.password || !state.credentialsLog.username ? (
              <Button
                className={classes.submit}
                type="submit"
                fullWidth
                disabled
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            ) : (
              <Button
                className={classes.submit}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            )
          ) : !state.credentialsReg.password || !state.credentialsReg.email ? (
            <Button
              className={classes.submit}
              type="submit"
              fullWidth
              disabled
              variant="contained"
              color="primary"
            >
              Register
            </Button>
          ) : (
            <Button
              className={classes.submit}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Register
            </Button>
          )}
          <span onClick={() => toggleView()} className={classes.span}>
            {state.isLoginView ? "Create Account ?" : "Back to login ?"}
          </span>
        </div>
      </form>
    </Container>
  );
};

export default withCookies(Login);
