export function AnswerOption(props) {
    const handleOptionChange = () => {
      if (props.onChange) {
        props.onChange(props.no); // Mengirimkan jawaban terpilih ke komponen induk
      }
    };
  
    return (
      <div className={`col-12 col-md-3 d-flex`}>
        <input type="radio" className="btn-check" name="options" id={`option` + props.no} autoComplete="off" checked={props.no === props.jawaban} onChange={handleOptionChange}/>
            <label htmlFor={`option` + props.no} className="p-4 border rounded-5 btn text-light animated answer-button d-flex flex-column align-items-center justify-content-center w-100">
              <div className={`col-content fs-${props.fs}`}>
                {props.isi}
              </div>
            </label>
      </div>
    );
  }