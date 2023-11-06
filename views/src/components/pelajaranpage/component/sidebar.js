import React, {useState, useEffect} from "react";
import { FontSizeChanger } from "./fontSizeChanger";
import { Steps, ConfigProvider, Progress, Statistic, Popover, Modal} from "antd";
const { Step } = Steps;
const { Countdown } = Statistic;
const gradient = { '0%': 'rgb(0, 108, 196)', '100%': '#153ec5' };
export const RightSidebar = (props) => {
    const [waktuTungguTerlewati, setWaktuTungguterlewati] = useState(false);
    const { fontSize, current, isEditMode, soalList, jawaban, toggleEditMode, handleFontSizeChange, onChange, handleJawabanChange, next, prev, persentaseProgres, submitTime, deadline, toggleStepVisibility, visibleSteps } = props;
    const waitTime = () =>{
      setWaktuTungguterlewati(true);
    }
    useEffect(() => {
        const checkWaktuTerlewati = () => {
          const currentTime = Date.now();
          if (currentTime > deadline - submitTime * 1000 * 60) {
            // Batas waktu telah terlewati, setel waktuTungguTerlewati menjadi true
            setWaktuTungguterlewati(true);
            // Hentikan interval karena kita sudah tidak perlu lagi memeriksanya
            clearInterval(intervalId);
          }
        };
    
        // Periksa status waktu setiap 1000 milidetik (1 detik)
        const intervalId = setInterval(checkWaktuTerlewati, 1000);
    
        // Hapus interval saat komponen tidak lagi digunakan
        return () => {
          clearInterval(intervalId);
        };
      }, []);

    const unlockSubmit = (
        <>
          <h6 className="mb-2">Syarat Penyelesaian</h6>
          <ul>
            {persentaseProgres < 100 && (
              <li>
                Selesaikan Semua Soal
                <Progress percent={persentaseProgres} />
              </li>
            )}
            {!waktuTungguTerlewati && (
              <li>
                Tunggu hingga
                <ConfigProvider
                  theme={{
                    token: {
                      fontSize: 8
                    }
                  }}
                >
                  <Countdown value={deadline - (submitTime * 1000 * 60)} onFinish={waitTime} />
                </ConfigProvider>
              </li>
            )}
          </ul>
        </>
      );
    return (
      <div className={`col-2 gradient2 text-light text-start d-none d-md-block h100vh rsidebar fs-${fontSize}`}>
        <h5 className="p-4 mt-5 text-center">menu</h5>
        <div className=" p-5 pb-0 pt-0">
          <FontSizeChanger fontSize={fontSize} handleFontSizeChange={handleFontSizeChange} />
        </div>
        <p className="p-5 pt-3 pb-0">daftar soal</p>
        <div className="p-3 pt-0 overflow-y-scroll text-light h-50 rounded-5 list-soal">
          <ConfigProvider
            theme={{
              token: {
                colorText: "white",
                colorTextBase:"white",
                colorTextLabel:"white"
              },
            }}
          >
            <Steps current={current} onChange={onChange} direction="vertical" className="p-4 pt-0 pb-0">
              {soalList.map((soal, index) => {
                const isFinished = jawaban[index] !== undefined && jawaban[index] !== "x";
                const stepStatus = isFinished ? "finish" : index === current ? "process" : "wait";
                const stepTitle = isFinished ? soalList[index].pertanyaan : visibleSteps[index] ? soalList[index].pertanyaan : "???";
  
                if (!visibleSteps[index] && stepStatus === "process") {
                  toggleStepVisibility(index);
                }
  
                return (
                  <Step
                    key={index}
                    title={stepTitle}
                    className="pilihan-jawaban text-nowrap overflow-hidden"
                    status={stepStatus}
                  />
                );
              })}
            </Steps>
          </ConfigProvider>
        </div>
        <div className="pt-4 d-flex align-items-center justify-content-center">
        {waktuTungguTerlewati && persentaseProgres === 100?
         (
            <button
            className={`btn border border-light border-opacity-25 btn-outline-light p-2 rounded-pill w-50`}
            onClick={() => {
                Modal.confirm({
                  title: 'Yakin ingin menyelesaikan sekarang?',
                  content: 'Periksa kembali soal yang anda kerjakan, tindakan ini tidak bisa dikembalikan!',
                  okText: 'submit',
                  okButtonProps: ({className:'rounded-pill'}),
                  cancelButtonProps:({className:'border rounded-pill m-2'}),
                  centered:'true',
                  cancelText: 'batal',
                  footer: (_, { OkBtn, CancelBtn }) => (
                    <>
                      <CancelBtn/>
                      <OkBtn />
                    </>
                  ),
                });
              }}

            >
            Selesai
            <i className={`fa fa-check p-2`} />
            </button>
        ):(
            <Popover content={unlockSubmit} placement="right">
            <button
            className={`btn border border-secondary border-opacity-25 btn-secondary p-2 rounded-pill w-50`}
            >
            Selesai
            <i className={`fa fa-lock p-2`} />
            </button>
            </Popover>
        )
        }
        </div>
      </div>
    );
  };