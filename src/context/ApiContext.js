import React, { createContext, useState, useEffect } from "react";
import { withCookies } from "react-cookie";
import axios from "axios";
export const ApiContext = createContext();

const ApiContextProvider = (props) => {
  const token = props.cookies.get("current-token");
  const [profile, setProfile] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [editedProfile, setEditedProfile] = useState({
    id: "",
    nickName: "",
    frame: "",
    framebrand: "",
    compo: "",
    compobrand: "",
    wheel: "",
    wheelbrand: "",
  });
  const [askList, setAskList] = useState([]);
  const [askListFull, setAskListFull] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [cover, setCover] = useState([]);

  useEffect(() => {
    const getMyProfile = async () => {
      try {
        const resmy = await axios.get(
          //自分のプロフィールの取得
          "http://localhost:8000/api/user/myprofile/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        //友達申請のリストを取得
        const res = await axios.get(
          "http://localhost:8000/api/user/approval/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        //1回目のレンダリングで自分のプロフィールを取得
        //querysetのためリストで取得されるのでオブジェクトとして取り出すために0を指定
        resmy.data[0] && setProfile(resmy.data[0]);
        resmy.data[0] &&
          setEditedProfile({
            id: resmy.data[0].id,
            nickName: resmy.data[0].nickName,
            frame: resmy.data[0].frame,
            framebrand: resmy.data[0].framebrand,
            compo: resmy.data[0].compo,
            compobrand: resmy.data[0].compobrand,
            wheel: resmy.data[0].wheel,
            wheelbrand: resmy.data[0].wheelbrand,
          });
        resmy.data[0] &&
          setAskList(
            res.data.filter((ask) => {
              //userProは自分の番号でそれと同じ番号への友達申請を取得
              return resmy.data[0].userPro === ask.askTo;
            })
          );
        setAskListFull(res.data);
      } catch {
        console.log("error");
      }
    };
    //全ユーザーのプロフィールを取得
    const getProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/user/profile/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setProfiles(res.data);
      } catch {
        console.log("error");
      }
    };
    //DMを取得
    const getInbox = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/dm/inbox/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setInbox(res.data);
      } catch {
        console.log("error");
      }
    };
    //呼び出し
    getMyProfile();
    getProfile();
    getInbox();
    //第二引数でタイミングを調整
  }, [token, profile.id]);

  //新規ユーザーのimg,nickNameの登録
  const createProfile = async () => {
    //APIへの新規作成にはFormDataで簡単に
    const createData = new FormData();
    createData.append("nickName", editedProfile.nickName);
    createData.append("frame", editedProfile.frame);
    createData.append("framebrand", editedProfile.framebrand);
    createData.append("compo", editedProfile.compo);
    createData.append("compobrand", editedProfile.compobrand);
    createData.append("wheel", editedProfile.wheel);
    createData.append("wheelbrand", editedProfile.wheelbrand);
    cover.name && createData.append("img", cover, cover.name);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/user/profile/",
        createData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      setProfile(res.data);
      setEditedProfile({
        id: res.data.id,
        nickName: res.data.nickName,
        frame: res.data.frame,
        framebrand: res.data.framebrand,
        compo: res.data.compo,
        compobrand: res.data.compobrand,
        wheel: res.data.wheel,
        wheelbrand: res.data.wheelbrand,
      });
    } catch {
      console.log("error");
    }
  };
  //プロフィールの削除
  const deleteProfile = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/user/profile/${profile.id}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      setProfiles(profiles.filter((dev) => dev.id !== profile.id));
      setProfile([]);
      setEditedProfile({
        id: "",
        nickName: "",
        frame: "",
        framebrand: "",
        compo: "",
        compobrand: "",
        wheel: "",
        wheelbrand: "",
      });
      setCover([]);
      setAskList([]);
    } catch {
      console.log("error");
    }
  };
  //編集(削除と同じ動き)
  const editProfile = async () => {
    const editData = new FormData();
    editData.append("nickName", editedProfile.nickName);
    editData.append("frame", editedProfile.frame);
    editData.append("framebrand", editedProfile.framebrand);
    editData.append("compo", editedProfile.compo);
    editData.append("compobrand", editedProfile.compobrand);
    editData.append("wheel", editedProfile.wheel);
    editData.append("wheelbrand", editedProfile.wheelbrand);
    cover.name && editData.append("img", cover, cover.name);
    try {
      const res = await axios.put(
        `http://localhost:8000/api/user/profile/${profile.id}/`,
        editData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      setProfile(res.data);
    } catch {
      console.log("error");
    }
  };
  //友達申請（引数はオブジェクト）
  const newRequestFriend = async (askData) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/user/approval/`,
        askData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      //既存の中に追加
      setAskListFull([...askListFull, res.data]);
    } catch {
      console.log("error");
    }
  };
  //ダイレクトメッセージの送信(引数はオブジェクト)
  const sendDMCont = async (uploadDM) => {
    try {
      await axios.post(`http://localhost:8000/api/dm/message/`, uploadDM, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
    } catch {
      console.log("error");
    }
  };
  //友達申請の承認(uploadDataAskはapproveをtrueにしたもの)
  const changeApprovalRequest = async (uploadDataAsk, ask) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/user/approval/${ask.id}/`,
        uploadDataAsk,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      //申請が承認されたものはtrueでまだされていないものはそまま渡される
      setAskList(askList.map((item) => (item.id === ask.id ? res.data : item)));

      //申請された側のapproveをtrueにする
      const newDataAsk = new FormData();
      newDataAsk.append("askTo", ask.askFrom);
      newDataAsk.append("approved", true);
      //お互い申請した場合
      const newDataAskPut = new FormData();
      newDataAskPut.append("askTo", ask.askFrom);
      newDataAskPut.append("askFrom", ask.askTo);
      newDataAskPut.append("approved", true);

      const resp = askListFull.filter((item) => {
        //左辺は自分の出した申請を取得、右辺のaskToは自分の申請している相手、asfFromは自分が申請をされている相手、
        //要するに自分の申請した相手と同じ相手から申請が来た場合を抽出
        return item.askFrom === profile.userPro && item.askTo === ask.askFrom;
      });
      //上記のフィルター後のユーザーが存在するかしないか
      !resp[0] //approveの変更を送信
        ? await axios.post(
            `http://localhost:8000/api/user/approval/`,
            newDataAsk,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
              },
            }
          ) //更新
        : await axios.put(
            `http://localhost:8000/api/user/approval/${resp[0].id}/`,
            newDataAskPut,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
              },
            }
          );
    } catch {
      console.log("error");
    }
  };
  //他のコンポーネントで使用できるように
  //基本はstateと関数のにあよう
  return (
    <ApiContext.Provider
      value={{
        profile,
        profiles,
        cover,
        setCover,
        askList,
        askListFull,
        inbox,
        newRequestFriend,
        createProfile,
        editProfile,
        deleteProfile,
        changeApprovalRequest,
        sendDMCont,
        editedProfile,
        setEditedProfile,
      }}
    >
      {/* Appに直接HTML要素を記入する場合に必要 */}
      {props.children}
    </ApiContext.Provider>
  );
};

export default withCookies(ApiContextProvider);
