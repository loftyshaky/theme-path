import React from "react";
import { observer } from "mobx-react";

import x from "x";
import { on_render } from "js/init_All";
import * as color_pickiers from "js/color_pickiers";
import * as toggle_popup from "js/toggle_popup";
import * as help_viewer from "js/help_viewer";
import * as tutorial from "js/tutorial";
import * as mutation_observer from "js/mutation_observer";
import * as history from "js/history";
import * as settings from "js/settings";

import { Error_boundary } from "components/Error_boundary";
import { Header } from "components/Header";
import { Fieldset } from "components/Fieldset";
import { Work_folder } from "components/Work_folder";
import { Input_block } from "components/Input_block";
import { History } from "components/History";
import { Bulk_copy } from "components/Bulk_copy";
import { Options } from "components/Options";
import { Help } from "components/Help";
import { Help_viewer } from "components/Help_viewer";
import { Protecting_screen } from "components/Protecting_screen";
import { Auto_updater } from "components/Auto_updater";
import { Analytics_privacy } from "components/Analytics_privacy";
import { Processing_msg } from "components/Processing_msg";

export class All extends React.Component {
  componentDidMount() {
    try {
      on_render();

      settings.set_settings_observable();
      tutorial.apply_alt_style_change_theme_properties_tutorial_item();

      document.addEventListener(
        "mousedown",
        color_pickiers.show_or_hide_color_pickier_when_clicking_on_color_input_vizualization
      );
      document.body.addEventListener(
        "keydown",
        color_pickiers.close_or_open_color_pickier_by_keyboard
      );
      document.body.addEventListener(
        "keydown",
        toggle_popup.close_all_popups_by_keyboard
      );
      document.body.addEventListener(
        "keydown",
        help_viewer.close_help_viewer_by_keyboard
      );
      window.addEventListener(
        "resize",
        tutorial.apply_alt_style_change_theme_properties_tutorial_item
      );

      history.set_history_side_popup_width();

      mutation_observer.observer.observe(s(".history_side_popup"), {
        attributes: true,
      });
    } catch (er) {
      err(er, 93);
    }
  }

  componentWillUnmount() {
    try {
      document.removeEventListener(
        "mousedown",
        color_pickiers.show_or_hide_color_pickier_when_clicking_on_color_input_vizualization
      );
      document.body.removeEventListener(
        "keydown",
        color_pickiers.close_or_open_color_pickier_by_keyboard
      );
      document.body.removeEventListener(
        "keydown",
        toggle_popup.close_all_popups_by_keyboard
      );
      document.body.removeEventListener(
        "keydown",
        help_viewer.close_help_viewer_by_keyboard
      );
      window.removeEventListener(
        "resize",
        tutorial.apply_alt_style_change_theme_properties_tutorial_item
      );
    } catch (er) {
      err(er, 94);
    }
  }

  render() {
    return (
      <Error_boundary>
        <div
          className="all"
          onMouseDown={(e) => {
            if (e.button === 1) e.preventDefault();
          }}
          role="none"
        >
          <Header />
          <div
            className={x.cls([
              "fieldsets",
              settings.ob.settings.wrap_theme_metadata_and_theme_fieldsets
                ? "wrap_theme_metadata_and_theme_fieldsets"
                : "",
            ])}
          >
            <Work_folder />
            <span className="theme_metadata_and_theme_fieldset_w">
              <Fieldset name="theme_metadata">
                <Input_block name="theme_metadata" />
              </Fieldset>
              <Fieldset name="theme">
                <Input_block name="images" hr add_help />
                <Input_block name="colors" hr add_help />
                <Input_block name="tints" hr add_help />
                <Input_block name="properties" hr add_help />
                <Input_block name="clear_new_tab" hr add_help />
              </Fieldset>
            </span>
          </div>
          <Protecting_screen
            tr_name="gen"
            state_key="protecting_screen_is_visible"
          />
          <Protecting_screen
            tr_name="analytics_privacy_protecting_screen"
            state_key="analytics_privacy_is_visible"
          />
          <History />
          <Bulk_copy />
          <Options />
          <Help />
          <Help_viewer />
          <Processing_msg />
          <Auto_updater />
          <Analytics_privacy />
        </div>
      </Error_boundary>
    );
  }
}

observer(All);
