const sectionsStyle = "w-full bg-gray-100 p-4 rounded-sm";
const titleStyle = "font-semibold text-md uppercase";

export default function VisibleColumns({ columnsArray, visibilityHandler }) {
  if (!columnsArray || columnsArray.length < 1) return null;

  return (
    <section className={sectionsStyle}>
      <span className={titleStyle}>visible columns</span>
      <div className="flex flex-wrap">
        {columnsArray.map((column, index) => {
          return (
            <div className="flex gap-x-2 m-4 items-center" key={index}>
              <input
                id={column.alias}
                type="checkbox"
                checked={column.display}
                onChange={(e) => visibilityHandler(e)}
              ></input>
              <label>{column.name}</label>
            </div>
          );
        })}
      </div>
    </section>
  );
}
