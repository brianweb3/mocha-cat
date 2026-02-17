import { useState, useEffect } from "react";
import { useCatStore } from "../../state/catState";
import { showToast } from "../../utils/toast";

const SHOP_ITEMS = {
  food: {
    kibble: { price: 10, name: "Kibble" },
    fish: { price: 25, name: "Fish" },
    treat: { price: 50, name: "Treat" },
  },
  medicine: {
    bandage: { price: 30, name: "Bandage" },
    vitamin: { price: 60, name: "Vitamin" },
  },
  toys: {
    ball: { price: 40, name: "Ball" },
    laser: { price: 80, name: "Laser" },
  },
};

export default function InventoryPanel() {
  const { dispatch, getState } = useCatStore();
  const [state, setState] = useState(getState());
  const [showShop, setShowShop] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setState(getState());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleBuy = (category, item, price) => {
    const result = dispatch({ type: "BUY_ITEM", payload: { category, item, price } });
    if (result.lastAction?.success) {
      showToast(`Bought ${item}!`, "success");
    } else {
      showToast(result.lastAction?.message || "Not enough coins", "error");
    }
  };

  return (
    <div
      style={{
        background: "#ffffff",
        border: "4px solid #000000",
        borderTop: "none",
        padding: "0",
        borderRadius: "0",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          background: "#000000",
          color: "#ff6600",
          padding: "8px 12px",
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        INVENTORY
      </div>
      <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", overflowX: "hidden" }}>
        {/* Coins Display */}
        <div
          style={{
            marginBottom: "15px",
            padding: "10px",
            background: "#f0f0f0",
            border: "2px solid #000000",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "12px", color: "#666" }}>Coins</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ff6600" }}>
            {state.economy.coins}
          </div>
        </div>

        {!showShop ? (
          <>
            {/* Inventory List */}
            <div style={{ marginBottom: "15px" }}>
              <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>Food:</div>
              {Object.entries(state.inventory.food).map(([item, count]) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "5px 0",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
                  <span style={{ color: "#ff6600", fontWeight: "bold" }}>{count}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: "15px" }}>
              <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>Medicine:</div>
              {Object.entries(state.inventory.medicine).map(([item, count]) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "5px 0",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
                  <span style={{ color: "#ff6600", fontWeight: "bold" }}>{count}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: "15px" }}>
              <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>Toys:</div>
              {Object.entries(state.inventory.toys).map(([item, count]) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "5px 0",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
                  <span style={{ color: "#ff6600", fontWeight: "bold" }}>{count}</span>
                </div>
              ))}
            </div>

            {/* Shop Button */}
            <button
              onClick={() => setShowShop(true)}
              style={{
                width: "100%",
                padding: "10px",
                background: "#ffffff",
                border: "2px solid #000000",
                borderRadius: "0",
                color: "#000000",
                cursor: "pointer",
                fontFamily: "DynaPuff, serif",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Shop
            </button>
          </>
        ) : (
          <>
            {/* Shop View */}
            <div style={{ marginBottom: "15px" }}>
              <button
                onClick={() => setShowShop(false)}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "10px",
                  background: "#f0f0f0",
                  border: "2px solid #000000",
                  borderRadius: "0",
                  color: "#000000",
                  cursor: "pointer",
                  fontFamily: "DynaPuff, serif",
                  fontSize: "12px",
                }}
              >
                ← Back
              </button>

              {Object.entries(SHOP_ITEMS).map(([category, items]) => (
                <div key={category} style={{ marginBottom: "15px" }}>
                  <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}:
                  </div>
                  {Object.entries(items).map(([item, data]) => (
                    <div
                      key={item}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px",
                        marginBottom: "5px",
                        border: "2px solid #000000",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "bold" }}>{data.name}</div>
                        <div style={{ fontSize: "11px", color: "#666" }}>{data.price} coins</div>
                      </div>
                      <button
                        onClick={() => handleBuy(category, item, data.price)}
                        disabled={state.economy.coins < data.price}
                        style={{
                          padding: "5px 15px",
                          background: state.economy.coins < data.price ? "#f0f0f0" : "#ffffff",
                          border: "2px solid #000000",
                          borderRadius: "0",
                          color: state.economy.coins < data.price ? "#999" : "#000000",
                          cursor: state.economy.coins < data.price ? "not-allowed" : "pointer",
                          fontFamily: "DynaPuff, serif",
                          fontSize: "12px",
                        }}
                      >
                        Buy
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
