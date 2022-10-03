import { useMemo, useState } from "react";  
import { DropDownList } from "@progress/kendo-react-dropdowns";  
import eventData from '../data/events.json';
  
// Dropdown categories  
const tar_wrongdoing = [0, 1, 2, 3];  
  
export const EventDropDownList = () => {  
    // Store currently selected category  
    const [category, setCategory] = useState("");  
    
    // Memoized results. Will re-evaluate any time selected  
    // category changes  
    const filteredData = useMemo(() => {  
      if (!category || category === "all") return data;  
    
      return data.filter(item => item.type === category);  
  }, [category]);

  return (
    <section className="k-my-8">
      <form className="k-form k-mb-4">
        <label className="k-label k-mb-3">tar_wrongdoing</label>
        <DropDownList data={tar_wrongdoing} onChange={e => setCategory(e.value)} />
      </form>

      <section className="k-listgroup">
        <ul>
          {filteredData.map(item => {
            return (
              <li key={item.id} className="k-listgroup-item">
                {item.label}
              </li>
            );
          })}
        </ul>
      </section>
    </section>
  );
};