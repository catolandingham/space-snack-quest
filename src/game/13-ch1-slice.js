// Chapter 1: the close-up paw arm (Day 2's cut-ins and the party's snack close-up draw it), and the finger
    // routing for the party's snack close-up (src/modules/party-snacks.js).
    function ch1SlicePointer(kind, x, y) {
      // The party's snack close-up (src/modules/party-snacks.js) takes the finger while it is open.
      if (partyCutOpen()) return void partyBeat().pointer(kind, x, y);
    }
    // The one close-up arm. Day 2's cut-ins call this same function. Do not draw a second copy.
    function drawPawArm(paw) {
      let p = paw || { x: 480, y: 580 },
        x = p.x,
        y = p.y,
        top = y + 20;
      e.save();
      e.beginPath();
      e.moveTo(x - 22, 662);
      for (let i = 1; i <= 8; i++) {
        let t = i / 8;
        e.lineTo(x + (i % 2 ? -48 : -28), 662 - (662 - top) * t);
      }
      e.lineTo(x + 26, top);
      for (let i = 8; i >= 1; i--) {
        let t = i / 8;
        e.lineTo(x + (i % 2 ? 50 : 30), 662 - (662 - top) * t);
      }
      (e.closePath(), (e.fillStyle = "#6b4428"), e.fill(), (e.lineWidth = 6), (e.strokeStyle = "#3a2416"), (e.lineJoin = "round"), e.stroke());
      [
        [0.08, -44, 6, "#e8c09a"],
        [0.17, -30, 13, "#c4895a"],
        [0.22, -50, 5, "#f4c39a"],
        [0.36, -26, 9, "#d9a06a"],
        [0.48, -46, 15, "#f0c49a"],
        [0.55, -32, 6, "#c4895a"],
        [0.69, -50, 10, "#e0b080"],
        [0.78, -24, 7, "#f4c39a"],
        [0.91, -40, 12, "#d7a070"],
        [0.11, 46, 11, "#f0c49a"],
        [0.24, 28, 6, "#e0b080"],
        [0.31, 52, 14, "#c4895a"],
        [0.46, 34, 8, "#f4c39a"],
        [0.6, 48, 5, "#d9a06a"],
        [0.73, 30, 12, "#e8c09a"],
        [0.86, 50, 7, "#c4895a"],
      ].forEach((tuft) => F(x + tuft[1], 652 - (652 - top) * tuft[0], tuft[2], tuft[3]));
      [[-26, -12], [-8, -22], [12, -22], [28, -10]].forEach(([dx, dy]) => {
        (e.beginPath(), e.ellipse(x + dx, y + dy, 13, 16, dx < 0 ? -0.35 : 0.35, 0, 7), (e.fillStyle = "#6b4428"), e.fill(), (e.strokeStyle = "#3a2416"), (e.lineWidth = 3), e.stroke(), F(x + dx, y + dy + 4, 5, "#f4c39a"));
      });
      (e.beginPath(), e.ellipse(x, y + 12, 24, 17, 0, 0, 7), (e.fillStyle = "#6b4428"), e.fill(), (e.strokeStyle = "#3a2416"), (e.lineWidth = 4), e.stroke(), e.beginPath(), e.ellipse(x, y + 16, 14, 9, 0, 0, 7), (e.fillStyle = "#f4c39a"), e.fill(), e.restore());
    }
