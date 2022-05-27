import x from "x";

const remote = require("@electron/remote");

export const generate_confirm_options = (msg, confirm_button) => {
  try {
    const dialog_options = {
      type: "question",
      title: x.msg("confirm_title"),
      buttons: [x.msg(confirm_button), x.msg("confirm_answer_cancel")],
      message: x.msg(msg),
      cancelId: 2, // whithout this hitting on close button returns choice === 0 with russian language
    };

    return dialog_options;
  } catch (er) {
    err(er, 286);
  }

  return undefined;
};

export const con = {
  win: remote.getCurrentWindow(),
};
