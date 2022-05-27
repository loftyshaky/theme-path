import { action, observable, decorate, computed, configure } from "mobx";
import * as chosen_folder_path from "js/chosen_folder_path";
import * as toggle_popup from "js/toggle_popup";
import * as help_viewer from "js/help_viewer";
import * as history from "js/history";
import * as bulk_copy from "js/bulk_copy";
import * as choose_folder from "js/work_folder/choose_folder";
import * as folders from "js/work_folder/folders";

configure({ enforceActions: "observed" });

export const try_to_set_btn_is_inactive_class = () => {
  try {
    return ob.applying_textarea_val ? "btn_is_inactive" : null;
  } catch (er) {
    err(er, 227);
  }

  return undefined;
};

export const set_applying_textarea_val_val = action((bool) => {
  try {
    ob.applying_textarea_val = bool;
  } catch (er) {
    err(er, 228);
  }
});

export const com = observable({
  get fieldset_protecting_screen_is_visible() {
    const work_folder_path = choose_folder.ob.work_folder;

    if (work_folder_path === chosen_folder_path.ob.chosen_folder_path) {
      const work_folder_info = folders.get_info_about_folder(work_folder_path);

      return !work_folder_info.is_theme;
    }

    return !folders.mut.chosen_folder_info.is_theme; // if any folder in work folder selected
  },
});

export const com2 = observable({
  get inputs_disabled_1() {
    return com.fieldset_protecting_screen_is_visible ||
      toggle_popup.ob.protecting_screen_is_visible ||
      history.ob.history_is_visible ||
      bulk_copy.ob.bulk_copy_is_visible ||
      help_viewer.ob.help_viewer_is_visible
      ? -1
      : 0;
  },
  get inputs_disabled_2() {
    return (
      com.fieldset_protecting_screen_is_visible ||
      toggle_popup.ob.protecting_screen_is_visible ||
      help_viewer.ob.help_viewer_is_visible ||
      bulk_copy.ob.history_is_visible ||
      bulk_copy.ob.bulk_copy_is_visible ||
      false
    );
  },
  get inputs_disabled_3() {
    return toggle_popup.ob.protecting_screen_is_visible ||
      history.ob.history_is_visible ||
      bulk_copy.ob.bulk_copy_is_visible ||
      help_viewer.ob.help_viewer_is_visible
      ? -1
      : 0;
  },
  get inputs_disabled_4() {
    return (
      toggle_popup.ob.protecting_screen_is_visible ||
      help_viewer.ob.help_viewer_is_visible ||
      history.ob.history_is_visible ||
      bulk_copy.ob.bulk_copy_is_visible ||
      false
    );
  },
  get inputs_disabled_5() {
    return (
      help_viewer.ob.help_viewer_is_visible ||
      history.ob.history_is_visible ||
      bulk_copy.ob.bulk_copy_is_visible ||
      false
    );
  },
});

export const ob = observable({
  applying_textarea_val: false, // true for 1 sec after typing in textarea
});
