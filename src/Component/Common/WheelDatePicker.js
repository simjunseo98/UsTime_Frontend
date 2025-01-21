import React, { useState } from "react";
import styles from "../../assets/style/Common/WheelDatepicker.module.scss";
const WheelDatepicker =({initialDate , maxDate , onDatechange})=>{
    const currentDate = new Date();
    const max = new Date(maxDate);
    const [selectDate , setSelectDate] =useState(new Date(initialDate || currentDate));

    const handleWheel = (type, delta) =>{
        const newDate = new Date(selectDate);

        switch(type){
            case "year" :
                newDate.setFullYear(newDate.getFullYear() + delta);
            break;
            case "month" :
                newDate.setMonth(newDate.getMonth() + delta);
            break;
            case "day" :
                newDate.setDate(newDate.getDate() + delta);
            break;
            default :
            break;
        }

        if(newDate > max) return;

        setSelectDate(newDate);
        onDatechange(newDate.toISOString().split("T")[0]);
    };
    return(
        <div className={styles.wheelDatePicker}>
        <div className={styles.picker}>
          <div
            className={styles.item}
            onWheel={(e) => handleWheel("year", e.deltaY < 0 ? 1 : -1)}
          >
            {selectDate.getFullYear()}년
          </div>
          <div
            className={styles.item}
            onWheel={(e) => handleWheel("month", e.deltaY < 0 ? 1 : -1)}
          >
            {String(selectDate.getMonth() + 1).padStart(2, "0")}월
          </div>
          <div
            className={styles.item}
            onWheel={(e) => handleWheel("day", e.deltaY < 0 ? 1 : -1)}
          >
            {String(selectDate.getDate()).padStart(2, "0")}일
          </div>
        </div>
      </div>
    );
};
export default WheelDatepicker;