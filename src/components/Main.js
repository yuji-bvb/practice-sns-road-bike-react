import React, { useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import Grid from "@material-ui/core/Grid";
import { GoMail } from "react-icons/go";
import { BsFillPeopleFill } from "react-icons/bs";
import Profile from "./Profile";
import ProfileManager from "./ProfileManager";
import Ask from "./Ask";
import InboxDM from "./InboxDM";

const Main = () => {
  const { profiles, profile, askList, askListFull, inbox } = useContext(
    ApiContext
  );
  //自分以外のプロフィールを取得
  const filterProfiles = profiles.filter((prof) => {
    return prof.id !== profile.id;
  });
  const listProfiles =
    filterProfiles &&
    filterProfiles.map((filprof) => (
      //カード一枚一枚
      <Profile
        key={filprof.id}
        profileData={filprof}
        //profile.jsへ渡す
        askData={askListFull.filter((ask) => {
          return (
            (filprof.userPro === ask.askFrom) | (filprof.userPro === ask.askTo)
          );
        })}
      />
    ));

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={7}>
        <Grid container spacing={0}>
          <div className="app-details">
            <ProfileManager />
          </div>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12} md={5}>
        <Grid container spacing={0}>
          <div className="app-profiles">
            <div className="task-list">{listProfiles}</div>
          </div>
        </Grid>
      </Grid>
      <Grid container justify="center">
        <Grid item xs={12} sm={12} md={12}>
          <Grid container spacing={0}>
            <div className="app-details">
              <h3 className="title-ask">
                <BsFillPeopleFill className="badge" />
                Friend list
              </h3>
              <div className="task-list">
                <ul>
                  {profile.id &&
                    askList.map((ask) => (
                      <Ask
                        key={ask.id}
                        ask={ask}
                        prof={profiles.filter((item) => {
                          return item.userPro === ask.askFrom;
                        })}
                      />
                    ))}
                </ul>
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Grid container justify="center">
        <Grid item xs={12} sm={12} md={12}>
          <Grid container spacing={0}>
            <div className="app-dms">
              <h3>
                <GoMail className="badge" />
                DM Inbox
              </h3>
              <div className="task-list">
                <ul>
                  {profile.id &&
                    inbox.map((dm) => (
                      <InboxDM
                        key={dm.id}
                        dm={dm}
                        prof={profiles.filter((item) => {
                          return item.userPro === dm.sender;
                        })}
                      />
                    ))}
                </ul>
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Main;
