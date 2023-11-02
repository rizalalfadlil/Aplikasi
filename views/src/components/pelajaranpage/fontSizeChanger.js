export function FontSizeChanger({fontSize, handleFontSizeChange}){
    return(
        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
              <input
                type="radio"
                className="btn-check"
                name="btnradio"
                id="btnradio1"
                value={4}
                checked={fontSize === 4}
                onChange={handleFontSizeChange}
              />
              <label className="btn rounded-start-pill btn-outline-primary align-items-center d-flex fs-4" htmlFor="btnradio1">FS-4</label>

              <input
                type="radio"
                className="btn-check"
                name="btnradio"
                id="btnradio2"
                value={5}
                checked={fontSize === 5}
                onChange={handleFontSizeChange}
              />
              <label className="btn btn-outline-primary align-items-center d-flex fs-5" htmlFor="btnradio2">FS-5</label>

              <input
                type="radio"
                className="btn-check"
                name="btnradio"
                id="btnradio3"
                value={6}
                checked={fontSize === 6}
                onChange={handleFontSizeChange}
              />
              <label className="btn rounded-end-pill btn-outline-primary align-items-center d-flex fs-6" htmlFor="btnradio3">FS-6</label>
      </div>

    )
}