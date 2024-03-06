import { useContext, useEffect, useState } from "react";
import { transpose } from "@/Utils/Utils";
import { useAuth } from "@/Contexts/AuthContext";
import useAsync from "@/Hooks/useAsync";
import axios from "@connections/NovaConnection";
import { EnrollPageIndexContext } from "..";

import ClassDetailContainer from "./Components/ClassDetailContainer";

import style from "./index.module.css";
import SelectedClassContainer from "./Components/SelectedClassContainer";
import { AnimatePresence } from "framer-motion";
import Button from "@/Components/Button";
import ConfirmModal from "./Components/ConfirmModal";

const timeTable = [
  ["3:30", "6:30"],
  ["5:00", "8:00"],
  ["6:30", "9:30"],
];

const weekTable = ["월", "화", "수", "목", "금"];

const makeClassTable = () =>
  Array.from(Array(timeTable.length), () => Array(weekTable.length).fill(null));

export default function SelectPage() {
  const { user } = useAuth();
  const { handleGotoNextPage } = useContext(EnrollPageIndexContext);
  const [classTable, setClassTable] = useState(makeClassTable());

  const [timeIndex, setTimeIndex] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]);

  const [modalState, setModalState] = useState(false);

  const getClasses = async () => {
    try {
      const response = await axios.get("/didimdolClass/allDidimdolClasses/");

      if (response.data.result === 0) {
        const responseData = response.data.didimdolClasses;
        const nextClassTable = makeClassTable();
        const startTimeNumberTable = transpose(timeTable)[0].map((el) =>
          Number(el.replace(":", ""))
        );

        responseData.forEach((el) => {
          const row = startTimeNumberTable.indexOf(
            Number(el.daytime.start.replace(":", ""))
          );
          const col = weekTable.indexOf(el.daytime.day);
          nextClassTable[row][col] = el;
        });
        setClassTable(nextClassTable);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const postClasses = async (userId, classes) => {
    try {
      const body = [
        {
          id: userId,
          didimdolClass: {
            wants: classes.map((el) => el._id),
          },
        },
      ];

      await axios.post("/user/updateUsers/", body);
      handleGotoNextPage();
    } catch (e) {
      console.error(e);
      throw new Error("서버와의 통신 중 오류가 발생했습니다");
    }
  };

  const [postPending, postError, postClassesAsync] = useAsync(postClasses);

  const insertSelectedClasses = (selectedClass) => {
    const nextSelectedClasses = [...selectedClasses];
    nextSelectedClasses.push(selectedClass);
    setSelectedClasses(nextSelectedClasses);
  };

  const deleteSelectedClasses = (selectedClass) => {
    const nextSelectedClasses = selectedClasses.filter(
      (el) => el !== selectedClass
    );
    setSelectedClasses(nextSelectedClasses);
  };

  const moveSelectedClass = (index, isDownward) => {
    const nextSelectedClasses = [...selectedClasses];
    const classToMove = nextSelectedClasses.splice(index, 1)[0];
    if (isDownward) {
      nextSelectedClasses.splice(index + 1, 0, classToMove);
    } else {
      nextSelectedClasses.splice(Math.max(index - 1, 0), 0, classToMove);
    }
    setSelectedClasses(nextSelectedClasses);
  };

  useEffect(() => {
    getClasses();
  }, []);

  return (
    <>
      <div className={style.selectPage}>
        <h1 className={style.header}>
          <span className={style.yellow}>디딤돌</span> 신청
        </h1>
        <p className={style.caution}>3월 14일까지 신청해주세요</p>

        <div className={style.timeTableContainer}>
          {timeTable.map((el, idx) => (
            <button
              key={idx}
              className={`${style.timeTableItem} ${
                idx === timeIndex ? style.selected : ""
              }`}
              onClick={() => {
                setTimeIndex(idx);
              }}
              disabled={idx === timeIndex}
            >
              {el[0]} ~ {el[1]}
            </button>
          ))}
        </div>

        {timeIndex !== null && (
          <>
            <div className={style.classContainer}>
              {weekTable.map((el, idx) => (
                <div key={idx} className={style.classItem}>
                  <p className={style.week}>{el}</p>
                  <button
                    className={`${style.classButton} ${
                      classTable[timeIndex][idx] === null
                        ? style.disabled
                        : classTable[timeIndex][idx] === selectedClass
                        ? style.selected
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedClass(classTable[timeIndex][idx]);
                    }}
                    disabled={
                      classTable[timeIndex][idx] === null ||
                      classTable[timeIndex][idx] === selectedClass
                    }
                  >
                    {classTable[timeIndex][idx] !== null
                      ? `${classTable[timeIndex][idx].title}조`
                      : "X"}
                  </button>
                </div>
              ))}
            </div>

            <div className={style.selectionContainer}>
              {selectedClasses.length > 0 ? (
                <div>
                  <p className={style.selectionHeader}>디딤돌 조 선택 현황</p>
                  <div className={style.selectionList}>
                    <AnimatePresence>
                      {selectedClasses.map((el, idx) => (
                        <SelectedClassContainer
                          key={el._id}
                          index={idx + 1}
                          data={el}
                          onDelete={() => {
                            deleteSelectedClasses(el);
                          }}
                          onMove={(isDownward) => {
                            moveSelectedClass(idx, isDownward);
                          }}
                          modifiable
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                  <div className={style.confirmButtonContainer}>
                    <Button
                      className={style.confirmButton}
                      disabled={selectedClasses.length === 0}
                      onClick={() => {
                        setModalState(true);
                      }}
                    >
                      신청하기
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={style.selectionDescription}>
                  아직 선택한 디딤돌 조가 없습니다.
                  <br />
                  <br />
                  <span className={style.bold}>
                    시간과 요일을 정하여 디딤돌조
                    <br />
                    슬로건 자세히 읽어보기
                  </span>
                </div>
              )}
            </div>
          </>
        )}
        <ClassDetailContainer
          data={selectedClass}
          onClose={() => {
            setSelectedClass(null);
          }}
          onConfirm={() => {
            insertSelectedClasses(selectedClass);
          }}
          inputCondition={
            selectedClasses.length >= 3 ||
            selectedClasses.includes(selectedClass)
          }
        />
      </div>
      {modalState && (
        <ConfirmModal
          onClose={() => {
            setModalState(false);
          }}
          onSubmit={() => {
            postClassesAsync(user.id, selectedClasses);
          }}
          classList={selectedClasses}
          pending={postPending}
          error={postError}
        />
      )}
    </>
  );
}
