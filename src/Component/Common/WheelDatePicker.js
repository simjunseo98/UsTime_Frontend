import React, { useState} from "react";
import styles from "../../assets/style/Common/WheelDatepicker.module.scss";


const WheelDatepicker =({initialDate , maxDate , onDateChange})=>{
    const currentDate = new Date();
    const max =new Date(maxDate+1);
    const [selectDate , setSelectDate] =useState(new Date(initialDate || currentDate));
    console.log("dd",initialDate);
    console.log("ddd",maxDate);
    const [activeDropdown, setActiveDropdown] = useState(null);

    // useEffect(() => {
    //   setSelectDate(initialDate);  // 부모 컴포넌트에서 전달된 초기 날짜로 설정
    // }, [initialDate]);

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
        onDateChange(newDate.toISOString().split("T")[0]);
    };
    const toggleDropdown = (type) => {
      setActiveDropdown(activeDropdown === type ? null : type);
    };

    const handleWheelEvent = (e) => {
      const delta = e.deltaY < 0 ? 1 : -1;
      if (activeDropdown === "year") {
        handleWheel("year", delta);
      } else if (activeDropdown === "month") {
        handleWheel("month", delta);
      } else if (activeDropdown === "day") {
        handleWheel("day", delta);
      }
      e.preventDefault();
    };
  
    const getYearList = () => {
      const currentYear = selectDate.getFullYear();
      return [currentYear - 1, currentYear, currentYear + 1];
    };
  
    const getMonthList = () => {
      const currentMonth = selectDate.getMonth() + 1;
      return [
        String(currentMonth - 1 || 12).padStart(2, "0"),
        String(currentMonth).padStart(2, "0"),
        String((currentMonth % 12) + 1).padStart(2, "0"),
      ];
    };
  
    const getDayList = () => {
      const currentDay = selectDate.getDate();
      return [
        String(currentDay - 1 || 31).padStart(2, "0"),
        String(currentDay).padStart(2, "0"),
        String((currentDay % 31) + 1).padStart(2, "0"),
      ];
    };
    return(
        <div className={styles.wheelDatePicker}>
        <div className={styles.picker} onWheel={handleWheelEvent}>
        <div className={styles.item} onClick={() => toggleDropdown("year")}>
          {selectDate.getFullYear()}년
          {activeDropdown === "year" && (
            <div className={styles.dropdown}>
              {getYearList().map((year, index) => (
                <div
                  key={index}
                  className={styles.dateItem}
                  onWheel={(e) => handleWheel("year", e.deltaY < 0 ? 1 : -1)}
                >
                  {year}년
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.item} onClick={() => toggleDropdown("month")}>
          {String(selectDate.getMonth() + 1).padStart(2, "0")}월
          {activeDropdown === "month"&& (
            <div className={styles.dropdown}>
              {getMonthList().map((month, index) => (
                <div
                  key={index}
                  className={styles.dateItem}
                  onWheel={(e) => handleWheel("month", e.deltaY < 0 ? 1 : -1)}
                >
                  {month}월
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.item} onClick={() => toggleDropdown("day")}>
          {String(selectDate.getDate()).padStart(2, "0")}일
          {activeDropdown === "day"&& (
            <div className={styles.dropdown}>
              {getDayList().map((day, index) => (
                <div
                  key={index}
                  className={styles.dateItem}
                  onWheel={(e) => handleWheel("day", e.deltaY < 0 ? 1 : -1)}
                >
                  {day}일
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    );
};
export default WheelDatepicker;