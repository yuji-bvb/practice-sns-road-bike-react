import React, { useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { makeStyles } from "@material-ui/core/styles";
import { BsPersonCheckFill } from "react-icons/bs";
import { MdAddAPhoto } from "react-icons/md";
import { BsTrash } from "react-icons/bs";
import { BsPersonPlus } from "react-icons/bs";
import { FaUserEdit } from "react-icons/fa";
import { IconButton } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  profile: {
    "& .image-wrapper": {
      textAlign: "center",
      position: "relative",
      "& button": {
        position: "absolute",
        top: "95%",
        left: "90%",
      },
      margin: 6,
    },
    "& .profile-image": {
      width: 700,
      height: 300,
      objectFit: "cover",
      maxWidth: "100%",
      backgroundColor: "white",
    },
    "& .profile-details": {
      textAlign: "center",
      "& span, svg": {
        verticalAlign: "middle",
        color: "lightgrey",
        fontFamily: '"Comix Neue", cursive',
      },
      TextField: {
        marginRight: 20,
      },
    },
    "& hr": {
      border: "none",
      margin: "0 0 7px 0",
    },
  },
}));

const ProfileManager = () => {
  const classes = useStyles();

  const frames = [
    "Bianchi",
    "CARRERA",
    "ANCHOR",
    "BASSO",
    "CANNONDALE",
    "cervelo",
    "COLNAGO",
    "DEROSA",
    "FELT",
    "FUJI",
    "LOOK",
    "GIANT",
    "GIOS",
    "GT",
    "KOGA",
    "MERIDA",
    "PINALELLO",
    "PENNAROLA",
    "TREK",
    "TIME",
    "SPECIALIZED",
    "SCOTT",
    "JAMIS",
    "KUOTA",
    "WILIER",
    "ORBEA",
    "EddyMerckx",
    "opera",
    "STORCK",
    "GARNEAU",
    "CANYON",
    "ARGON18",
    "CEEPO",
    "AVANTI",
    "CUBE",
    "GUERCIOTTI",
    "GURU",
    "KESTREL",
    "KEMO",
    "CHERUBIM",
    "CENTURION",
    "DimondBikes",
    "Diamondback",
    "CIPOLLINI",
    "cinelli",
    "DedacciaiSTRADA",
    "TRIGON",
    "Dolan",
    "THOMPSON",
    "NEILPRYDE",
    "Panasonic",
    "BH",
    "BMC",
    "LOUISGARNEAU",
    "VIVELO",
    "RIDLEY",
    "FACTOR",
    "FOCUS",
    "BOTTECCHIA",
    "boardman",
    "momentum",
    "YAMAHA",
    "YONEX",
    "Litespeed",
    "LAPIERRE",
  ];

  const components = ["SHIMANO", "SRAM", "Campagnolo"];
  const wheels = [
    "SPINERGY",
    "Campagnolo",
    "SHIMANO",
    "BONTRAGER",
    "FULCRUM",
    "MAVIC",
    "SRAM",
    "A CLASS ",
    "AMBROSIO",
    "BOMA",
    "CORIMA",
    "DT SWISS",
    "EASTON",
    "EDCO",
    "ENVE",
    "EQUINOX",
    "FFWD",
    "GANWELL",
    "GOKISO",
    "HALO",
    "HED",
    "HOPE",
    "IRWIN CYCLING",
    "LIGHTWEIGHT",
    "MICHE",
    "MULLER",
    "NOVATEC",
    "PRO LITE",
    "PROFILE DESIGN",
    "PZRACING",
    "REYNOLDS",
    "ROLF PRIMA",
    "SPECIALIZED",
    "TNi",
    "TOKEN",
    "TOPOLINO",
    "URSUS",
    "VITTORIA",
    "VISION",
    "XeNTis",
    "XERO",
    "ZIPP",
    "3T",
  ];

  const {
    profile,
    editedProfile,
    setEditedProfile,
    deleteProfile,
    cover,
    setCover,
    createProfile,
    editProfile,
  } = useContext(ApiContext);
  const handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };
  const handleInputChange = () => (event) => {
    const value = event.target.value;
    const name = event.target.name;
    setEditedProfile({ ...editedProfile, [name]: value });
  };
  return (
    <div className={classes.profile}>
      <div className="image-wrapper">
        {profile.id ? (
          <img src={profile.img} alt="profile" className="profile-image" />
        ) : (
          <img
            src="http://127.0.0.1:8000/media/image/null.png"
            alt="profile"
            className="profile-image"
          />
        )}
        <input
          type="file"
          id="imageInput"
          hidden="hidden"
          onChange={(event) => {
            setCover(event.target.files[0]);
            event.target.value = "";
          }}
        />
        <IconButton onClick={handleEditPicture}>
          <MdAddAPhoto className="photo" />
        </IconButton>
      </div>
      {editedProfile.id ? (
        editedProfile.nickName ? (
          <button className="user" onClick={() => editProfile()}>
            <FaUserEdit />
          </button>
        ) : (
          <button className="user-invalid" disabled>
            <FaUserEdit />
          </button>
        )
      ) : editedProfile.nickName && cover.name ? (
        <button className="user" onClick={() => createProfile()}>
          <BsPersonPlus />
        </button>
      ) : (
        <button className="user-invalid" disabled>
          <BsPersonPlus />
        </button>
      )}
      <button className="trash" onClick={() => deleteProfile()}>
        <BsTrash />
      </button>

      <div className="profile-details">
        <BsPersonCheckFill className="badge" />
        {/* {profile && <span>{profile.nickName}</span>} */}
        <TextField
          type="text"
          value={editedProfile.nickName}
          name="nickName"
          onChange={handleInputChange()}
        />
        <hr />
        <Typography variant="h4" component="h4">
          FRAME
        </Typography>
        <TextField
          variant="outlined"
          id="standard-select-currency"
          select
          value={editedProfile.framebrand}
          name="framebrand"
          onChange={handleInputChange()}
        >
          {frames.map((myframe) => (
            <MenuItem key={myframe} value={myframe}>
              {myframe}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="outlined-basic"
          variant="outlined"
          type="text"
          value={editedProfile.frame}
          name="frame"
          onChange={handleInputChange()}
        />
        <hr />
        <Typography variant="h4" component="h4">
          COMPO
        </Typography>
        <TextField
          variant="outlined"
          id="standard-select-currency"
          select
          value={editedProfile.compobrand}
          name="compobrand"
          onChange={handleInputChange()}
        >
          {components.map((mycompo) => (
            <MenuItem key={mycompo} value={mycompo}>
              {mycompo}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="outlined-basic"
          variant="outlined"
          type="text"
          value={editedProfile.compo}
          name="compo"
          onChange={handleInputChange()}
        />
        <hr />
        <Typography variant="h4" component="h4">
          WHEEL
        </Typography>
        <TextField
          variant="outlined"
          id="standard-select-currency"
          select
          value={editedProfile.wheelbrand}
          name="wheelbrand"
          onChange={handleInputChange()}
        >
          {wheels.map((mywheel) => (
            <MenuItem key={mywheel} value={mywheel}>
              {mywheel}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="outlined-basic"
          variant="outlined"
          type="text"
          value={editedProfile.wheel}
          name="wheel"
          onChange={handleInputChange()}
        />
      </div>
    </div>
  );
};

export default ProfileManager;
