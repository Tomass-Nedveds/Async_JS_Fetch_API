import { useState } from "react";

function DogGenerator() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDog = async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const res = await fetch("https://dog.ceo/api/breeds/image/random");

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();
      setImageUrl(data.message);
    } catch (err) {
      setError("Neizdevās ielādēt attēlu :(");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Uzdevums II — Dog Image Generator</h2>

      <button onClick={loadDog} style={{ padding: "10px 20px" }}>
        Load dog
      </button>

      <div style={{ marginTop: "20px" }}>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {imageUrl && <img src={imageUrl} alt="Dog" width="300" />}
      </div>
    </div>
  );
}

export default DogGenerator;
