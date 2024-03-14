import style from "./ClassContainer.module.css";

export default function ClassContainer({ didimdol }) {
  return (
    <div className={style.classContainer}>
      <p className={style.classHeader}>
        MY
        <br />
        TEAM
      </p>
      <div className={style.classDescriptionWrapper}>
        <p className={`${style.classDescription} ${style.bold}`}>
          {didimdol?.title}조 {didimdol?.daytime?.day}
          요일 오후 {didimdol?.daytime?.start}
        </p>
        <p className={style.classDescription}>
          강사:{" "}
          {didimdol?.lecturer?.map(
            (el, idx, arr) => el.name + (idx < arr.length - 1 ? ", " : "")
          )}
        </p>
        <p className={style.classDescription}>
          조장:{" "}
          {didimdol?.assistants?.map(
            (el, idx, arr) => el.name + (idx < arr.length - 1 ? ", " : "")
          )}
        </p>
      </div>
    </div>
  );
}
