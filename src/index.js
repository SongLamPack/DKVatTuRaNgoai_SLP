const URL =
  "https://script.google.com/macros/s/AKfycbxR8Mav6na6elkJIEi28xvtfLCXFMJZ1Jmq1er009z7MYuhXGoHRI0bsOhp4W0b7FE-/exec";
const dsvattu = document.querySelector(".dsvattu");
const btnThemVT = document.getElementById("btnAdd");
const btnguidk = document.getElementById("btnguidk");
const btnmangvao = document.getElementById("btnmangvao");
const btnkiemtra = document.getElementById("btnkiemtra");
const btnktravao = document.getElementById("btnktravao");
const listItems = document.querySelectorAll(".menu li");
const modal = document.getElementById("dangchay");
var dsns = [];
var stt = 1;
const idnguoidk = document.getElementById("idngdk");
const idhotendk = document.getElementById("idhotendk");
const idbophan = document.getElementById("idbophan");
const idchucvu = document.getElementById("idchucvu");
const idngaythang = document.getElementById("idngaythang");
const idgiora = document.getElementById("idgiora");
const idmucdich = document.getElementById("idmucdich");
const idnguoimang = document.getElementById("idnguoimang");
const idphuongtien = document.getElementById("idphuongtien");
const idghichu = document.getElementById("idghichu");
const idquanly = document.getElementById("quanly");
const idhanghoa = document.getElementById("idhanghoa");
const iddiadiem = document.getElementById("iddiadiem");

listItems.forEach((item) => {
  item.addEventListener("click", function () {
    var pgname = this.getAttribute("value");
    var pgclick = document.getElementById(pgname);
    if (pgclick !== null) {
      listItems.forEach((li) => {
        // Xóa class 'selected' khỏi tất cả các mục <li> khác
        li.classList.remove("active");
        var pgname = li.getAttribute("value");
        var pg = document.getElementById(pgname);
        try {
          pg.classList.add("hidden");
        } catch {}
      });
      // Thêm class 'selected' cho mục <li> vừa nhấp vào
      pgclick.classList.remove("hidden");
      this.classList.add("active");
      if (pgname === "pgdangky") {
        fetchDs();
      }
    }
  });
});

function fetchDs() {
  if (dsns.length === 0) {
    let submitData = {
      type: "dangky",
    };
    console.log("đang lấy danh sách nhân sự");
    modal.classList.add("display");
    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(submitData), // p data type must match "Content-Type" header
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        dsns = [...data];
        modal.classList.remove("display");
      })
      .catch((error) => {
        console.error("Error:", error);
        modal.classList.remove("display");
        alert("Không tìm thấy cơ sở dữ liệu nhân sự, vui lòng kiểm tra lại");
      });
  }
}

btnThemVT.addEventListener("click", (e) => {
  e.preventDefault();
  stt += 1;
  const temporaryDiv = document.createElement("div");
  var innerEle = `<div class ="VT${stt}" style="display:flex">
  <input class = "soTT VT${stt}" style="width:18px;border: none" value="${stt}/" readonly></input>
  <div>
    <textarea class="tenvattu VT${stt}" style="width:295px; height:43px;" placeholder="Tên vật tư, tài sản"></textarea>
  </div>
  <div>
    <input class="DVT VT${stt}" type="text" style="width:50px;" placeholder="ĐVT"></input>
    <br>
    <input class="SoLuong VT${stt}" type="number" style="width:50px; margin-bottom:2px;" placeholder="SL"></input>
    <button id= "VT${stt}" class="btnXoaVT${stt}" style="width:21px;background-color:red;font-weight: ;">X</button>
  </div>
  </div>`;

  temporaryDiv.innerHTML = innerEle;
  while (temporaryDiv.firstChild) {
    dsvattu.appendChild(temporaryDiv.firstChild);
  }
  var btnXoa = document.querySelector(`.btnXoaVT${stt}`);
  lay_lai_tt();

  btnXoa.addEventListener("click", (e) => {
    e.preventDefault();
    var tt = btnXoa.getAttribute("id");
    var dsinput = document.querySelector(`.${tt}`);
    dsvattu.removeChild(dsinput);
    lay_lai_tt();
  });
});

function lay_lai_tt() {
  var dsSoTT = document.querySelectorAll(".soTT");
  for (var i = 0; i < dsSoTT.length; i++) {
    dsSoTT[i].value = `${i + 1}/`;
  }
}

idnguoidk.addEventListener("input", (e) => {
  idnguoidk.value = idnguoidk.value.toUpperCase();
  // idquanly.value = "";
  if (idnguoidk.value.length >= 7) {
    const nv = dsns.find(
      (nv) => nv.MaNV.toLowerCase() === idnguoidk.value.toLowerCase()
    );
    if (!nv) {
      idhotendk.value = "không tìm thấy";
      idhotendk.classList.add("fal");
      idhotendk.classList.remove("done");
      idbophan.value = "";
      idchucvu.value = "";
    } else {
      idhotendk.classList.remove("fal");
      idhotendk.classList.add("done");
      idhotendk.value = nv.HoTen;
      idbophan.value = nv.BoPhan;
      idchucvu.value = nv.ChucVu;
      var dsql = [];
      dsql = dsns.filter(
        (rs) =>
          // rs.BoPhan.toLowerCase() === idbophan.value.toLowerCase() &&
          rs.CapDuyet.toLowerCase() === "trưởng bộ phận" ||
          rs.CapDuyet.toLowerCase() === "phó phòng"
      );

      if (dsql.length > 0) {
        // var innerSelect = `<label>Quản lý xác nhận:</label>
        // <select id="quanly" style="font-size:16px; height: 25px;">`;
        var innerSelect = `<option value="">- Chọn quản lý xác nhận -</option>`;
        dsql.forEach(
          (rs) =>
            (innerSelect += `<option value ="${rs.HoTen}|${rs.BoPhan}">[${rs.BoPhan}] ${rs.HoTen}</option>`)
        );
        // innerSelect += `</select>`;
        idquanly.innerHTML = innerSelect;
      } else {
        idquanly.innerHTML = "";
      }
    }
  } else {
    idhotendk.value = "";
    idbophan.value = "";
    idchucvu.value = "";
  }
});

btnguidk.addEventListener("click", (e) => {
  e.preventDefault();
  var stt = document.querySelectorAll(".soTT");
  var tenvattu = document.querySelectorAll(".tenvattu");
  var dvt = document.querySelectorAll(".DVT");
  var SoLuong = document.querySelectorAll(".SoLuong");
  var dsdangky = [];
  var checkinput = "true";
  for (var i = 0; i < tenvattu.length; i++) {
    var vattu = tenvattu[i].value;
    var dv = dvt[i].value;
    var slg = SoLuong[i].value;
    var tt = stt[i].value;
    if (vattu === "") {
      tenvattu[i].classList.add("thieudl");
      checkinput = "false";
    } else {
      tenvattu[i].classList.remove("thieudl");
    }
    if (dv === "") {
      dvt[i].classList.add("thieudl");
      checkinput = "false";
    } else {
      dvt[i].classList.remove("thieudl");
    }
    if (slg === "") {
      SoLuong[i].classList.add("thieudl");
      checkinput = "false";
    } else {
      SoLuong[i].classList.remove("thieudl");
    }
    dsdangky.push(`${tt} ${vattu}: ${slg} (${dv})`);
  }
  if (checkinput === "false") {
    alert("Vui lòng nhập đầy đủ thông tin vật tư, tài sản");
    return;
  }
  const MaNV = idnguoidk.value;
  const HoTen = idhotendk.value;
  const BoPhan = idbophan.value;
  const ChucVu = idchucvu.value;
  const NgayThang = idngaythang.value;
  const GioRa = idgiora.value;
  const MucDich = idmucdich.value;
  const NguoiMang = idnguoimang.value;
  const PhuongTien = idphuongtien.value;
  const GhiChu = idghichu.value;
  const QuanLy = idquanly.value;
  const DiaDiem = iddiadiem.value;
  const LoaiHang = idhanghoa.checked ? "Hàng hóa" : "Tài sản";
  console.log(LoaiHang);
  if (MaNV === "") {
    alert("Vui lòng nhập mã nhân viên");
    return;
  }
  if (HoTen === "" || HoTen === "không tìm thấy") {
    alert("Mã nhân viên chưa đúng, vui lòng kiểm tra lại");
    return;
  }
  if (NgayThang === "" || GioRa === "") {
    alert("Vui lòng nhập đầy đủ ngày tháng, thời gian dự kiến");
    return;
  }
  if (MucDich === "") {
    alert("Vui lòng nhập mục đích mang vật tư, tài sản ra ngoài");
    return;
  }
  if (QuanLy === "") {
    alert("Vui lòng chọn quản lý xác nhận");
    return;
  }
  if (NguoiMang === "") {
    alert("Vui lòng nhập người mang ra ngoài");
    return;
  }
  // if (PhuongTien === "") {
  //   alert("Vui lòng nhập phương tiện sử dụng - biển số xe (nếu có)");
  //   return;
  // }
  var ngaythang = NgayThang.split("-");
  var qs = confirm(
    `XÁC NHẬN! \nGửi đăng ký mang vật tư, tài sản RA NGOÀI công ty ngày ${ngaythang[2]}/${ngaythang[1]}/${ngaythang[0]}`
  );
  if (qs === true) {
    modal.classList.add("display");
    const type = "dangkyvattura";
    const data = {
      MaNV,
      HoTen,
      BoPhan,
      ChucVu,
      dsdangky,
      MucDich,
      NguoiMang,
      PhuongTien,
      DiaDiem,
      NgayThang,
      GioRa,
      GhiChu,
      QuanLy,
      LoaiHang,
    };
    const submitData = { type, data };
    console.log(submitData);
    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(submitData), // p data type must match "Content-Type" header
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data === true) {
          alert(
            "✅ Đăng ký thành công! Vui lòng liên hệ với quản lý để được xác nhận"
          );
        } else {
          alert("❌ Đăng ký không thành công ⚠ Vui lòng thử lại");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("❌ Đăng ký không thành công ⚠ Vui lòng thử lại");
      });
    modal.classList.remove("display");
  }
});

btnmangvao.addEventListener("click", (e) => {
  e.preventDefault();
  var stt = document.querySelectorAll(".soTT");
  var tenvattu = document.querySelectorAll(".tenvattu");
  var dvt = document.querySelectorAll(".DVT");
  var SoLuong = document.querySelectorAll(".SoLuong");
  var dsdangky = [];
  var checkinput = "true";
  for (var i = 0; i < tenvattu.length; i++) {
    var vattu = tenvattu[i].value;
    var dv = dvt[i].value;
    var slg = SoLuong[i].value;
    var tt = stt[i].value;
    if (vattu === "") {
      tenvattu[i].classList.add("thieudl");
      checkinput = "false";
    } else {
      tenvattu[i].classList.remove("thieudl");
    }
    if (dv === "") {
      dvt[i].classList.add("thieudl");
      checkinput = "false";
    } else {
      dvt[i].classList.remove("thieudl");
    }
    if (slg === "") {
      SoLuong[i].classList.add("thieudl");
      checkinput = "false";
    } else {
      SoLuong[i].classList.remove("thieudl");
    }
    dsdangky.push(`${tt} ${vattu}: ${slg} (${dv})`);
  }
  if (checkinput === "false") {
    alert("Vui lòng nhập đầy đủ thông tin vật tư, tài sản");
    return;
  }
  const MaNV = idnguoidk.value;
  const HoTen = idhotendk.value;
  const BoPhan = idbophan.value;
  const ChucVu = idchucvu.value;
  const NgayThang = idngaythang.value;
  const GioRa = idgiora.value;
  const MucDich = idmucdich.value;
  const NguoiMang = idnguoimang.value;
  const PhuongTien = idphuongtien.value;
  const GhiChu = idghichu.value;
  const QuanLy = idquanly.value;
  const DiaDiem = iddiadiem.value;
  const LoaiHang = idhanghoa.checked ? "Hàng hóa" : "Tài sản";
  console.log(LoaiHang);
  if (MaNV === "") {
    alert("Vui lòng nhập mã nhân viên");
    return;
  }
  if (HoTen === "" || HoTen === "không tìm thấy") {
    alert("Mã nhân viên chưa đúng, vui lòng kiểm tra lại");
    return;
  }
  if (NgayThang === "" || GioRa === "") {
    alert("Vui lòng nhập đầy đủ ngày tháng, thời gian dự kiến");
    return;
  }
  if (MucDich === "") {
    alert("Vui lòng nhập mục đích mang vật tư, tài sản mang vào");
    return;
  }
  if (QuanLy === "") {
    alert("Vui lòng chọn quản lý xác nhận");
    return;
  }
  if (NguoiMang === "") {
    alert("Vui lòng nhập người mang vào");
    return;
  }
  // if (PhuongTien === "") {
  //   alert("Vui lòng nhập phương tiện sử dụng - biển số xe (nếu có)");
  //   return;
  // }
  var ngaythang = NgayThang.split("-");
  var qs = confirm(
    `XÁC NHẬN! \nGửi đăng ký mang vật tư, tài sản VÀO trong công ty ngày ${ngaythang[2]}/${ngaythang[1]}/${ngaythang[0]}`
  );
  if (qs === true) {
    modal.classList.add("display");
    const type = "dangkyvattuvao";
    const data = {
      MaNV,
      HoTen,
      BoPhan,
      ChucVu,
      dsdangky,
      MucDich,
      NguoiMang,
      PhuongTien,
      DiaDiem,
      NgayThang,
      GioRa,
      GhiChu,
      QuanLy,
      LoaiHang,
    };
    const submitData = { type, data };
    console.log(submitData);
    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(submitData), // p data type must match "Content-Type" header
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data === true) {
          alert(
            "✅ Đăng ký thành công! Vui lòng liên hệ với quản lý để được xác nhận"
          );
        } else {
          alert("❌ Đăng ký không thành công ⚠ Vui lòng thử lại");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("❌ Đăng ký không thành công ⚠ Vui lòng thử lại");
      });
    modal.classList.remove("display");
  }
});

const idmatracuu = document.getElementById("matracuu");
const idngaytracuu = document.getElementById("ngaytracuu");
idmatracuu.addEventListener("input", (e) => {
  idmatracuu.value = idmatracuu.value.toUpperCase();
});

btnkiemtra.addEventListener("click", (e) => {
  e.preventDefault();
  var resultEle = document.getElementById("result");
  var name = idmatracuu.value;
  var date = idngaytracuu.value;
  var idate = parseInt(date.split("-").join(""));
  if (name === "") {
    alert("Vui lòng nhập mã nhân viên tra cứu");
    return;
  }

  let submitData = {
    type: "check",
    data: { name, idate },
  };
  modal.classList.add("display");
  console.log(submitData);
  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(submitData), // p data type must match "Content-Type" header
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      modal.classList.remove("display");
      render(data, "DUYỆT");
    })
    .catch((error) => {
      console.error("Error:", error);
      modal.classList.remove("display");
      resultEle.innerHTML = `
      <div class="koduyet" style="color:red">
      <p>Không có kết quả nào phù hợp!</p>
      </div>
      `;
      // alert("không có kết quả nào, hãy kiểm tra thông tin tra cứu và thử lại");
    });
});

btnktravao.addEventListener("click", (e) => {
  e.preventDefault();
  var resultEle = document.getElementById("result");
  var name = idmatracuu.value;
  var date = idngaytracuu.value;
  var idate = parseInt(date.split("-").join(""));
  if (name === "") {
    alert("Vui lòng nhập mã nhân viên tra cứu");
    return;
  }

  let submitData = {
    type: "checkmangvao",
    data: { name, idate },
  };
  modal.classList.add("display");
  console.log(submitData);
  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(submitData), // p data type must match "Content-Type" header
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      modal.classList.remove("display");
      render(data, "XÁC NHẬN");
    })
    .catch((error) => {
      console.error("Error:", error);
      modal.classList.remove("display");
      resultEle.innerHTML = `
      <div class="koduyet" style="color:red">
      <p>Không có kết quả nào phù hợp!</p>
      </div>
      `;
      // alert("không có kết quả nào, hãy kiểm tra thông tin tra cứu và thử lại");
    });
});

function render(listdata, typeData) {
  var resultEle = document.getElementById("result");
  var innerHtml = "";
  for (var i = 0; i < listdata.length; i++) {
    var data = listdata[i];
    innerHtml += `<div id="formketqua" class="${
      data.KetQua === 1 ? "dcduyet" : data.KetQua === -1 ? "koduyet" : ""
    }">
    <div>
      <h2 style="margin:0;text-align:center" class="${
        data.KetQua === 1 ? "done" : data.KetQua === -1 ? "fal" : "wait"
      }">${
      data.KetQua === 1
        ? "ĐƯỢC " + typeData
        : data.KetQua === -1
        ? "KHÔNG ĐƯỢC " + typeData
        : "ĐANG CHỜ " + typeData
    }</h2>
    </div>
    <div>
      <label>Người đăng ký:</label><br>
      <input type="text" style="width:133px" readonly Value="${
        data.MaNV
      }"></input>
      <input type="text" style="width:235px" readonly Value="${
        data.HoTen
      }"></input>
    </div>
      <div>
      <input type="text" style="width:133px" readonly Value="${
        data.BoPhan
      }"></input>
      <input type="text" style="width:235px" readonly Value="${
        data.ChucVu
      }"></input>
    </div>
      <div style="padding-top:10px">
      <label style="font-size:14px">Danh sách người vào công ty:</label><br>
      <textarea style="font-size:16px;width:380px; height:${
        data.DSVatTu.split(String.fromCharCode(10)).length * 38
      }px" readonly type="text">${data.DSVatTu}</textarea >   
    </div>
    <div style="display:flex;padding-top:10px">
      <div style="text-align:right">
        <label>Ngày tháng:</label>
        <input type="text" style="width:90px" readonly value="${
          data.NgayThang
        }"></input>
      </div>
      <div style="padding-left:15px;text-align:right">
        <label>Giờ:</label>
        <input type="text" style="width:50px" readonly value="${
          data.GioRa
        }"></input>
      </div>
    </div>
    <div style="padding-top:10px">  
      <input type="text" style="width:380px" readonly value="Người mang ra: ${
        data.NguoiMang
      }"></input>
      <br><input type="text" style="width:380px" readonly value="Mục đích: ${
        data.MucDich
      }"></input>
      <br><input type="text" style="width:380px" readonly value="Phương tiện: ${
        data.PhuongTien
      }"></input>
      <br><input type="text" style="width:380px" readonly value="Ghi chú: ${
        data.GhiChu
      }"></input>
    </div>  
    <div style="padding-top:10px">  
      <label>Trưởng bộ phận:</label>
      <input class="${
        data.TBPDuyet === "Duyệt"
          ? "done"
          : data.TBPDuyet === "Không"
          ? "fal"
          : "wait"
      }" style="width:68%" type="text" readonly value="${data.TruongBP} [${
      data.TBPDuyet
    }]"></input>
      <br><label>Phó Giám đốc:</label>
      <input class="${
        data.NSDuyet === "Duyệt"
          ? "done"
          : data.NSDuyet === "Không"
          ? "fal"
          : "wait"
      }" style="width:72%" type="text" readonly value="${data.PhongNS} [${
      data.NSDuyet
    }]"></input>
      <br><label>Giám đốc:</label>
      <input class="${
        data.GDDuyet === "Duyệt"
          ? "done"
          : data.GDDuyet === "Không"
          ? "fal"
          : "wait"
      }" style="width:78%" type="text" readonly value="${data.GiamDoc} [${
      data.GDDuyet
    }]"></input>
      <br><label>Nội dung duyệt:</label>
      <input style="width:70%" type="text" readonly value="${
        data.LyDoDuyet
      }"></input>
    </div>  
  </div>`;
  }
  resultEle.innerHTML = innerHtml;
}
