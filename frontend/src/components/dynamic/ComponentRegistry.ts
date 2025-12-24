import { type Component } from "vue";
import Button from "./Button.vue";
import Container from "./Container.vue";
import Heading from "./Heading.vue";
import Text from "./Text.vue";
import Card from "./Card.vue";
import Collapsible from "./Collapsible.vue";
import Toggle from "./Toggle.vue";
import Dropdown from "./Dropdown.vue";
import Checkbox from "./Checkbox.vue";
import TextInput from "./TextInput.vue";
import DatePicker from "./DatePicker.vue";

export const ComponentRegistry: Record<string, Component> = {
    // Básicos
    button: Button,
    container: Container,
    heading: Heading,
    text: Text,

    // Estructurales
    card: Card,
    collapsible: Collapsible,
    containerCollapsible: Collapsible,

    // Formularios
    toogle: Toggle,
    toggle: Toggle,
    dropdown: Dropdown,
    dropdownDatePicker: Dropdown,
    checkBox: Checkbox,
    checkbox: Checkbox,
    radioGroup: Dropdown,
    input: TextInput,
    textInput: TextInput,
    date: DatePicker,
    datePicker: DatePicker,
};
export const getComponent = (type: string): Component | null => {
    return ComponentRegistry[type] || null;
};