import * as color_pickiers from 'js/color_pickiers';

export const simulate_click_on_enter = e => {
    if (e.keyCode === sta.enter_key_code) {
        document.activeElement.click();
    }
};

export const open_color_pickier_on_enter = e => {
    if (e.keyCode === sta.enter_key_code) {
        const color_input_vizualization = document.activeElement;
        const event = { target: color_input_vizualization };

        color_pickiers.show_or_hide_color_pickier_when_clicking_on_color_input_vizualization(event);
    }
};

//> variables
const sta = {
    enter_key_code: 13,
};
//< variables
