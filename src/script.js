document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('chart').getContext('2d');
    let chartInstance;

    // Load the CSV data
    fetch('data/expenditure.csv')
        .then(response => response.text())
        .then(data => {
            const parsedData = parseFlippedCSV(data);

            // Populate dropdown with years
            const yearSelect = document.getElementById('yearSelect');
            parsedData.years.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.text = year;
                yearSelect.appendChild(option);
            });

            // Create checkboxes for each category
            const categoryCheckboxesDiv = document.getElementById('categoryCheckboxes');
            parsedData.categories.forEach(category => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `checkbox-${category}`;
                checkbox.value = category;
                checkbox.name = 'category';

                const label = document.createElement('label');
                label.htmlFor = `checkbox-${category}`;
                label.textContent = category;

                categoryCheckboxesDiv.appendChild(checkbox);
                categoryCheckboxesDiv.appendChild(label);
                categoryCheckboxesDiv.appendChild(document.createElement('br'));
            });

            // Event listener for "Check All" and "Check None"
            document.getElementById('checkAll').addEventListener('click', () => {
                document.querySelectorAll('input[name="category"]').forEach(checkbox => checkbox.checked = true);
            });

            document.getElementById('checkNone').addEventListener('click', () => {
                document.querySelectorAll('input[name="category"]').forEach(checkbox => checkbox.checked = false);
            });

            // Event listener for showing the pie chart
            document.getElementById('yearButton').addEventListener('click', () => {
                if (chartInstance) chartInstance.destroy();
                const selectedYear = yearSelect.value;
                chartInstance = createPieChart(ctx, parsedData, selectedYear);
            });

            // Event listener for the bar chart button
            document.getElementById('barButton').addEventListener('click', () => {
                if (chartInstance) chartInstance.destroy();
                const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
                    .map(checkbox => checkbox.value);
                chartInstance = createBarChart(ctx, parsedData, selectedCategories);
            });
        });

    function parseFlippedCSV(data) {
        const rows = data.split('\n').filter(row => row.trim() !== '');
        const headers = rows[0].split(',');
        const categories = rows.slice(1).map(row => row.split(',')[0]);
        const expenditures = rows.slice(1).map(row => row.split(',').slice(1));

        return {
            years: headers.slice(1),
            categories: categories,
            data: expenditures.map(row => row.map(value => parseFloat(value) || 0))
        };
    }

    function createBarChart(ctx, data, selectedCategories) {
        const selectedData = selectedCategories.map(category => {
            const categoryIndex = data.categories.indexOf(category);
            return {
                label: category,
                data: data.data[categoryIndex],
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 70%)`
            };
        });

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.years,
                datasets: selectedData
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function createPieChart(ctx, data, selectedYear) {
        const yearIndex = data.years.indexOf(selectedYear);
        const expendituresForYear = data.data.map(row => row[yearIndex]);

        return new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.categories,
                datasets: [{
                    data: expendituresForYear,
                    backgroundColor: data.categories.map(() => `hsl(${Math.random() * 360}, 70%, 70%)`)
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false // Disable the global legend display
                    },
                    tooltip: {
                        enabled: true
                    }
                },
                plugins: [ChartDataLabels],
                datalabels: {
                    color: '#fff',
                    formatter: (value, ctx) => {
                        let datasets = ctx.chart.data.datasets;
                        let total = datasets[0].data.reduce((acc, currentValue) => acc + currentValue, 0);
                        let percentage = ((value / total) * 100).toFixed(1) + '%';
                        return value > 10 ? `${ctx.chart.data.labels[ctx.dataIndex]}: ${percentage}` : ''; // Only display for values above 10%
                    },
                    anchor: 'end',
                    align: 'end',
                    offset: 5,
                    borderColor: '#000',
                    borderWidth: 1,
                    borderRadius: 3,
                    clamp: true
                }
            }
        });
    }
});

// Function to handle tab switching
function openTab(event, tabName) {
    const tabContent = document.getElementsByClassName("tabcontent");
    const tabLinks = document.getElementsByClassName("tablinks");

    // Hide all tab content
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    // Remove the active class from all tab links
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    // Show the current tab and add the active class to the corresponding button
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";
}