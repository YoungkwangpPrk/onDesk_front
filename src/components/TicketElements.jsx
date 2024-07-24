import React from "react";
import {
  FlexBox,
  Text,
  Input,
  Select,
  DatePicker,
  Option,
  MultiComboBox,
  MultiComboBoxItem,
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents/dist/features/InputElementsFormSupport.js";
import "@ui5/webcomponents-localization/dist/Assets.js";

import "../assets/styles/TicketElements.css";

function TicketElement(props) {
  const date = new Date();
  return (
    // <FlexBox className='element-box'>
    <div className="card">
      {props.type === "input" ? (
        <div className="element-column">
          <div className="element-row">
            <Text className="element-title">{props.title}</Text>
            {props.required === true && <Text className="required">*</Text>}
          </div>
          <Input
            className="input-element"
            disabled={props.finish && true}
            name={props.name}
            valueState={props.valid !== undefined && "Error"}
            type={props.inputType}
            value={props.content}
            onChange={props.onChange}
            maxlength={40}
          />
        </div>
      ) : props.type === "select" ? (
        <div className="element-column">
          <div className="element-row">
            <Text className="element-title">{props.title}</Text>
            {props.required === true && <Text className="required">*</Text>}
          </div>
          {props.title === "소요시간" ? (
            <div className="row-box">
              <Input
                maxlength={3}
                className="select-element-time-input"
                name={props.name}
                onChange={props.onChange}
                disabled={props.finish && true}
                value={props.hours}
              />
              <Text className="element-divider">:</Text>
              <Select
                className="select-element-time"
                onChange={props.func}
                disabled={props.finish && true}
              >
                {props.item.map((i, item) => (
                  <Option
                    key={item}
                    selected={
                      i ===
                        props.content
                          ?.toString()
                          .slice(props.content.length - 2) && true
                    }
                  >
                    {i}
                  </Option>
                ))}
              </Select>
            </div>
          ) : (
            <Select
              className="select-element"
              onChange={props.func}
              disabled={props.finish && true}
            >
              {props.item.map((i, item) => (
                <Option
                  key={item}
                  data-id={i.email}
                  selected={(i.email || i) === props.content && true}
                >
                  {i.name ? i.name : i}
                </Option>
              ))}
            </Select>
          )}
        </div>
      ) : props.type === "multi" ? (
        <>
          <Text className="element-title">{props.title}</Text>
          <MultiComboBox onChange={props.func}>
            {props.item.map((i) => (
              <MultiComboBoxItem key={i} text={i} />
            ))}
          </MultiComboBox>
        </>
      ) : (
        <div className="element-column">
          <div className="element-row">
            <Text className="element-title">{props.title}</Text>
            {props.required === true && <Text className="required">*</Text>}
          </div>
          <DatePicker
            id={props.id}
            disabled={props.finish && true}
            onChange={props.func}
            value={props.content}
            minDate={!props.admin && date.toISOString().split("T")[0]}
            formatPattern="yyyy-MM-dd"
          />
        </div>
      )}
    </div>
    // </FlexBox>
  );
}

export default TicketElement;
