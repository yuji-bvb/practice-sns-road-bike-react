import React, { useState, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import Button from "@material-ui/core/Button";
import Modal from "react-modal";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { RiMailAddLine } from "react-icons/ri";
import { IoIosSend } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
// import Card from "@material-ui/core/Card";
// import CardMedia from "@material-ui/core/CardMedia";
// import CardContent from "@material-ui/core/CardContent";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  text: {
    width: 250,
    maxWidth: "100%",
    margin: theme.spacing(3),
  },
}));

const Ask = ({ ask, prof }) => {
  const classes = useStyles();
  //React-Modak使用時の定型文
  Modal.setAppElement("#root");
  const { changeApprovalRequest, sendDMCont } = useContext(ApiContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [text, setText] = useState("");

  const customStyles = {
    content: {
      width: 300,
      height: 200,
      maxWidth: "100%",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
    },
  };

  const handleInputChange = () => (event) => {
    const value = event.target.value;
    setText(value);
  };
  const sendDM = () => {
    const uploadDM = new FormData();
    uploadDM.append("receiver", ask.askFrom);
    uploadDM.append("message", text);
    sendDMCont(uploadDM);
    setModalIsOpen(false);
  };
  const changeApproval = () => {
    const uploadDataAsk = new FormData();
    uploadDataAsk.append("askTo", ask.askTo);
    uploadDataAsk.append("approved", true);
    changeApprovalRequest(uploadDataAsk, ask);
  };

  return (
    <li className="list-item">
      <h4>{prof[0].nickName}</h4>

      {!ask.approved ? (
        <Button
          size="small"
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => changeApproval()}
        >
          Approve
        </Button>
      ) : (
        <button className="mail" onClick={() => setModalIsOpen(true)}>
          <RiMailAddLine />
        </button>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
      >
        <Typography className="modal-title">Message</Typography>
        <TextField
          className={classes.text}
          type="text"
          onChange={handleInputChange()}
        />
        <br />
        <div className="btn-posi">
          <button className="btn-modal" onClick={() => setModalIsOpen(false)}>
            <IoMdClose />
          </button>
          <button className="btn-modal" onClick={() => sendDM()}>
            <IoIosSend />
          </button>
        </div>
      </Modal>
    </li>
  );
};

export default Ask;
