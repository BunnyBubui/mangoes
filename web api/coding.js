let items = [];
        let currentItem = null; // To store the current item for edit

        // Fetch items from the server
        async function fetchItems() {
            try {
                let response = await fetch("http://localhost:3000/items");
                let data = await response.json();
                items = data;
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        }

        // Display a single item
        function displayItem(item) {
            const container = document.getElementById('item-container');
            container.innerHTML = ''; // Clear previous results

            if (item) {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item');
                itemDiv.innerHTML = `
                    <div class="d-flex justify-content-between">
                        <span>ชื่อ: ${item.name}</span>
                        <span>ID: ${item.id}</span>
                    </div>
                    <button class="btn btn-outline-light" onclick="editItem(${item.id})">แก้ไข</button>
                    <button class="btn btn-danger" onclick="deleteItem(${item.id})">ลบ</button>
                `;
                container.appendChild(itemDiv);
            } else {
                container.innerHTML = '<p>ไม่พบข้อมูลที่ค้นหา</p>';
            }
        }

        // Search for an item by ID or Name
        async function searchItem() {
            const searchQuery = document.getElementById('searchId').value.toLowerCase();

            // ตรวจสอบว่าเป็นเลข ID หรือชื่อ
            if (isNaN(searchQuery)) {
                // ถ้าเป็นชื่อ
                try {
                    const response = await fetch(`http://localhost:3000/students/name/${searchQuery}`);
                    const data = await response.json();
                    displayItems(data);
                } catch (error) {
                    console.error("Error searching by name:", error);
                }
            } else {
                // ถ้าเป็น ID
                try {
                    const response = await fetch(`http://localhost:3000/students/student/${searchQuery}`);
                    const data = await response.json();
                    displayItem(data); // แสดงผลลัพธ์ที่ได้จากการค้นหาตาม ID
                } catch (error) {
                    console.error("Error searching by ID:", error);
                }
            }
        }

        // Toggle Add Form visibility
        function toggleAddForm() {
            const addForm = document.getElementById('addForm');
            addForm.style.display = addForm.style.display === 'none' ? 'block' : 'none';
        }

        // Add new item
        // เพิ่มข้อมูลนักศึกษา
        async function addItem() {
            const name = document.getElementById('addName').value;
            const id = document.getElementById('addId').value;

            if (name && id) {
                const newItem = { name, student: parseInt(id) }; // สร้างข้อมูลใหม่
                try {
                    const response = await fetch("http://localhost:3000/students", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(newItem)
                    });
                    const data = await response.json();
                    displayItem(data); // แสดงข้อมูลที่เพิ่มใหม่
                    document.getElementById('addName').value = '';
                    document.getElementById('addId').value = '';
                    document.getElementById('addForm').style.display = 'none';
                } catch (error) {
                    console.error("Error adding student:", error);
                }
            } else {
                alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            }
        }


        // Edit an item
        // แก้ไขข้อมูลนักศึกษา
        async function saveEditItem() {
            if (currentItem) {
                currentItem.name = document.getElementById('editName').value;
                currentItem.student = document.getElementById('editId').value;

                try {
                    const response = await fetch(`http://localhost:3000/students/${currentItem._id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(currentItem)
                    });
                    const data = await response.json();
                    displayItem(data); // แสดงข้อมูลที่แก้ไขแล้ว
                    document.getElementById('editForm').style.display = 'none';
                    currentItem = null; // Reset currentItem
                } catch (error) {
                    console.error("Error saving edit:", error);
                }
            }
        }


        function saveEditItem() {
            if (currentItem) {
                currentItem.name = document.getElementById('editName').value;
                currentItem.id = document.getElementById('editId').value;
                displayItem(currentItem); // Display updated item
                document.getElementById('editForm').style.display = 'none';
                currentItem = null; // Reset current item
            }
        }

        // Cancel edit
        function cancelEdit() {
            document.getElementById('editForm').style.display = 'none';
            currentItem = null; // Reset current item
        }

        async function deleteItem(id) {
            if (confirm("คุณแน่ใจหรือว่าต้องการลบข้อมูลนักศึกษานี้?")) {
                try {
                    const response = await fetch(`http://localhost:3000/students/${id}`, {
                        method: "DELETE",
                    });
        
                    if (response.ok) {
                        alert("ลบข้อมูลสำเร็จ!");
                        // ลบรายการจากหน้าเว็บ
                        document.getElementById(`student-${id}`).remove();
                    } else {
                        alert("ไม่สามารถลบข้อมูลได้");
                    }
                } catch (error) {
                    console.error("Error deleting student:", error);
                }
            }
        }

        window.onload = function () {
            document.getElementById('loader').style.display = 'none';
            fetchItems();
        };

        // Particles.js setup
        particlesJS("particles-js", {
            particles: {
                number: { value: 100, density: { enable: true, value_area: 800 } },
                color: { value: "#ffffff" },
                shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
                opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
                size: { value: 3, random: true, anim: { enable: true, speed: 4, size_min: 0.1, sync: false } },
                move: { enable: true, speed: 2, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" } }
            }
        });