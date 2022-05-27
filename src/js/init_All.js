import React from "react";
import ReactDOM from "react-dom/client";

import x from "x";
import "js/tab_focus";
import * as options from "js/options";
import * as odd_elements_highlighting from "js/odd_elements_highlighting";

import { All } from "components/All";

options.load_setting();
options.load_theme();
odd_elements_highlighting.set_odd_elements_color();

//> render options page ui
ReactDOM.createRoot(s("#root")).render(
  <All /> // eslint-disable-line react/jsx-filename-extension
);

export const on_render = async () => {
  try {
    //>1 remove no_tr css
    await x.delay(500);

    x.remove(s(".no_tr"));
    //<1 remove no_tr css
  } catch (er) {
    err(er, 332);
  }
};

x.localize(document);
//< render options page ui
