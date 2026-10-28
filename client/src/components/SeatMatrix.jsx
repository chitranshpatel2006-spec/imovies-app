import React from 'react';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const getSeatCategory = (row) => {
  if (['A', 'B'].includes(row)) return 'vip';
  if (['C', 'D'].includes(row)) return 'premium';
  return 'standard';
};

const SeatMatrix = ({ showtime, selectedSeats, onToggleSeat }) => {
  const bookedSet = new Set(showtime.bookedSeats || []);

  const getPrice = (type) => {
    const prices = showtime.ticketPrice || { standard: 220, premium: 320, vip: 450 };
    return prices[type] || 250;
  };

  return (
    <div className="seat-matrix-wrapper my-4">
      {/* Curved Screen Graphic */}
      <div className="screen-perspective text-center mb-5">
        <div className="cinema-screen mx-auto" style={{ maxWidth: '480px' }}></div>
        <div className="screen-text mt-2">
          <i className="bi bi-display me-1"></i> Screen (Eyes This Way)
        </div>
      </div>

      {/* Seat Rows */}
      <div className="seat-grid d-flex flex-column gap-3 align-items-center">
        {ROWS.map((row) => {
          const category = getSeatCategory(row);
          return (
            <div key={row} className="seat-row d-flex align-items-center justify-content-center gap-2">
              <span className="seat-row-label text-muted fw-bold">{row}</span>

              <div className="d-flex gap-2">
                {COLS.map((col) => {
                  const seatId = `${row}${col}`;
                  const isBooked = bookedSet.has(seatId);
                  const isSelected = selectedSeats.some((s) => s.seatId === seatId);

                  let btnClass = 'seat-btn';
                  if (isBooked) {
                    btnClass += ' booked';
                  } else if (isSelected) {
                    btnClass += ' selected';
                  } else {
                    btnClass += ` available ${category}`;
                  }

                  // Aisle spacing after 5th seat
                  const hasAisle = col === 5;

                  return (
                    <React.Fragment key={seatId}>
                      <button
                        type="button"
                        className={btnClass}
                        disabled={isBooked}
                        title={`Seat ${seatId} (${category.toUpperCase()} - ₹${getPrice(category)})`}
                        onClick={() =>
                          onToggleSeat({
                            seatId,
                            row,
                            number: col,
                            type: category,
                            price: getPrice(category),
                          })
                        }
                      >
                        {col}
                      </button>
                      {hasAisle && <div style={{ width: '24px' }}></div>}
                    </React.Fragment>
                  );
                })}
              </div>

              <span className="seat-row-label text-muted fw-bold">{row}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="d-flex flex-wrap justify-content-center gap-4 mt-5 pt-3 border-top border-secondary border-opacity-25 small text-muted">
        <div className="d-flex align-items-center gap-2">
          <div className="seat-btn available" style={{ width: '22px', height: '22px', cursor: 'default' }}></div>
          <span>Available</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat-btn selected" style={{ width: '22px', height: '22px', cursor: 'default' }}></div>
          <span>Selected</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat-btn booked" style={{ width: '22px', height: '22px', cursor: 'default' }}></div>
          <span>Booked / Reserved</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat-btn vip available" style={{ width: '22px', height: '22px', cursor: 'default' }}></div>
          <span>VIP Tier (Rows A-B)</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMatrix;
