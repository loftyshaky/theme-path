import { ipcRenderer } from "electron";

import * as confirm from "js/confirm";

const remote = require("@electron/remote");

ipcRenderer.on("close_app", () => {
  const dialog_options = confirm.generate_confirm_options(
    "app_close_confirm_msg",
    "app_close_confirm_answer_quit"
  );
  const choice = remote.dialog.showMessageBoxSync(
    confirm.con.win,
    dialog_options
  );

  if (choice === 0) {
    ipcRenderer.send("set_let_app_close_var_to_true_and_close_app");
  } else {
    ipcRenderer.send("set_let_app_close_var_to_false");
  }
});
