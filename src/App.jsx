import Posts from "./Posts";
import DogGenerator from "./DogGenerator";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>React Uzdevumi</h1>

      {/* Uzdevums I */}
      <Posts />

      <hr style={{ margin: "40px 0" }} />

      {/* Uzdevums II */}
      <DogGenerator />
    </div>
  );
}

export default App;
