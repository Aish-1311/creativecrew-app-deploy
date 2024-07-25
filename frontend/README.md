# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


### SQL queries for creating `seat_allocation, business_unit, manager_allocation, employee_allocation` tables in `seat-allocation-db` database
CREATE TABLE business_unit (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    manager VARCHAR(100),
    role VARCHAR(100)
);

INSERT INTO business_unit(name, manager, role)
VALUES ('cloud', 'Hima Bindhu', '5664'),
		('service', 'Ashish Jain', '5264'),
		('cloud', 'John Abram', '5384');

CREATE TABLE seat_allocation (
    id SERIAL PRIMARY KEY,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
	campus VARCHAR(100),
    floor INTEGER NOT NULL,
    total INTEGER NOT NULL,
    bu_id INTEGER REFERENCES business_unit(id),
    seats INTEGER[] 
);

INSERT INTO seat_allocation (country, city, state, campus, floor, total, bu_id, seats)
VALUES ('India', 'Hyderabad', 'Telengana', 'Knowledge City', 5, 200, 1, '{1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
														11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 
														21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 
														31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
														41, 42, 43, 44, 45, 46, 47, 48, 49, 50}'),
		('India', 'Hyderabad', 'Telengana', 'Knowledge City', 6, 160, 2, '{51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 
														61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 
														71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 
														81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 
														91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 
														101, 102, 103, 104, 105}'),
		('UK', 'London', 'England', 'Gresham Street', 10, 180, 3, '{106,107,108,109,110,111,112,113,114,115, 
													116,117,118,119,120,121,122,123,124,125, 
													126,127,128,129,130, 131,132,133,134,135,
													136,137,138,139,140,141,142,143,144,145, 
													146, 147, 148, 149, 150, 151, 152, 153, 154, 155,
													156, 157, 158, 159, 160}'),
		('India', 'Hyderabad', 'Telengana', 'Mindspace', 7, 150, 1, '{51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 
														61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 
														71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 
														81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 
														91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 
														101, 102, 103, 104, 105}'),
		('India', 'Hyderabad', 'Telengana', 'Knowledge City', 6, 170, 1, '{106,107,108,109,110,111,112,113,114,115, 
													116,117,118,119,120,121,122,123,124,125, 
													126,127,128,129,130, 131,132,133,134,135,
													136,137,138,139,140,141,142,143,144,145, 
													146, 147, 148, 149, 150, 151, 152, 153, 154, 155,
													156, 157, 158, 159, 160}'),
	('India', 'Bengaluru', 'Karnataka', 'M E Business Park', 11, 250, 1, '{1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
														11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 
														21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 
														31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
														41, 42, 43, 44, 45, 46, 47, 48, 49, 50}'),
	('India', 'Bengaluru', 'Karnataka', 'Manyata Tech Park', 7, 150, 1, '{51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 
														61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 
														71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 
														81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 
														91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 
														101, 102, 103, 104, 105}'),
	('UK', 'London', 'England', 'Gresham Street', 10, 195, 1, '{106,107,108,109,110,111,112,113,114,115, 
													116,117,118,119,120,121,122,123,124,125, 
													126,127,128,129,130, 131,132,133,134,135,
													136,137,138,139,140,141,142,143,144,145, 
													146, 147, 148, 149, 150, 151, 152, 153, 154, 155,
													156, 157, 158, 159, 160}');

CREATE TABLE manager_allocation (
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(100),
	last_name VARCHAR(100),
	business_unit VARCHAR(100),
	country VARCHAR(100) NOT NULL,
	state VARCHAR(100),
    city VARCHAR(100) NOT NULL,
	campus VARCHAR(100),
	floor INT,
	seats_array INT[],
	hoe_id INT REFERENCES business_unit(id)
);


INSERT INTO manager_allocation (first_name, last_name, business_unit, country, state, city, campus, floor, seats_array, hoe_id)
VALUES ('David', 'Brown', 'cloud', 'India', 'Telengana', 'Hyderabad', 'Knowledge City', 5, '{1,2,3,4,5,6,7,8,9,10}', 1),
		('Emma', 'Davis', 'cloud', 'India', 'Telengana', 'Hyderabad', 'Knowledge City', 5, '{11,12,13,14,15,16,17,18,19,20,21,22,23,24,25}', 1),
		('Frank', 'Miller', 'cloud', 'India', 'Telengana', 'Hyderabad', 'Knowledge City', 5, '{26,27,28,29,30}', 1),
		('George', 'Wilson', 'service', 'India', 'Telengana', 'Hyderabad', 'Knowledge City', 6, '{51,52,53,54,55,56,57}', 2),
		('Helen', 'Moore', 'service', 'India', 'Telengana', 'Hyderabad', 'Knowledge City', 6, '{58,59,60,61,62,63,64,65,66,67,68,69,70,71}', 2),
		('Irene', 'Taylor', 'service', 'India', 'Telengana', 'Hyderabad', 'Knowledge City', 6, '{72,73,74,75,76,77,78,79,80,81,82,83,84}', 2),
		('Jack', 'Anderson', 'cloud', 'UK', 'England', 'London', 'Gresham Street', 10, '{106,107,108,109,110,111,112,113,114,115}', 3), 
		('Karn', 'Thomas', 'cloud', 'UK', 'England', 'London', 'Gresham Street', 10, '{116,117,118,119,120,121,122,123,124,125,126,127,128,129,130}', 3),
		('Larry', 'Martinez', 'cloud', 'UK', 'England', 'London', 'Gresham Street', 10, '{131,132,133,134,135,136,137,138,139,140,141,142,143,144,145}', 3),
		('Oscar', 'Bennett', 'cloud', 'India', 'Telengana', 'Hyderabad', 'Mindspace', 7, '{51,52,53,54,55,56,57}', 1),
		('Penelope', 'Clark', 'cloud', 'India', 'Telengana', 'Hyderabad', 'Mindspace', 7, '{58,59,60,61,62,63,64,65,66,67,68,69,70,71}', 1),
		('Quentin', 'Diaz', 'cloud', 'India', 'Telengana', 'Hyderabad', 'Mindspace', 7, '{72,73,74,75,76,77,78,79,80,81,82,83,84}', 1),
		('Rebecca', 'Foster', 'cloud', 'India', 'Telengana', 'Hyderabad', 'Knowledge City', 6, '{106,107,108,109,110,111,112,113,114,115}', 1 ),
		('Simon', 'Grant', 'cloud', 'India', 'Telengana', 'Hyderabad', 'Knowledge City', 6, '{116,117,118,119,120,121,122,123,124,125,126,127,128,129,130}', 1 ),
		('Tessa', 'Hughes', 'cloud', 'India', 'Telengana', 'Hyderabad', 'Knowledge City', 6, '{131,132,133,134,135,136,137,138,139,140,141,142,143,144,145}', 1 )
		('Priyanka', 'Patil', 'cloud', 'India', 'Karnataka', 'Bengaluru', 'Manyata Tech Park', 7, '{51,52,53,54,55,56,57}', 1 ),
		('Divya', 'Das', 'cloud', 'India', 'Karnataka', 'Bengaluru', 'Manyata Tech Park', 7, '{58,59,60,61,62,63,64,65,66,67,68,69,70,71}', 1 );
	


CREATE TABLE employee_allocation(
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(100),
	last_name VARCHAR(100),
	business_unit VARCHAR(100),
	seat_data jsonb ,
	manager_id INT REFERENCES manager_allocation(id)
);


INSERT INTO employee_allocation(first_name, last_name, business_unit, seat_data, manager_id) 
VALUES ('Steven', 'Howard', 'cloud', '{"Monday" : 3, "Tuesday" : 1, "Wednesday" : 3, "Thursday" : 8, "Friday" : "WFH"}', 1 ),
		('William', 'Simmons', 'cloud', '{"Monday" : 4, "Tuesday" : 4, "Wednesday" : 4, "Thursday" : 4, "Friday" : 4}', 1 ),
		('Vanessa', 'Foster', 'cloud', '{"Monday" : 5, "Tuesday" : 5, "Wednesday" : 5, "Thursday" : 5, "Friday" : 5}', 1 ),
		('Teresa', 'Ward', 'cloud', '{"Monday" : 6, "Tuesday" : 6, "Wednesday" : 6, "Thursday" : 6, "Friday" : 6}', 1 ),
		('Ruby', 'Cox', 'cloud', '{"Monday" : 7, "Tuesday" : 7, "Wednesday" : 7, "Thursday" : 7, "Friday" : 7}', 1 ),
		('Quinn', 'Richardson', 'cloud', '{"Monday" : 11, "Tuesday" : 11, "Wednesday" : 11, "Thursday" : 11, "Friday" : 11}', 2 ),
		('Paul', 'Cooper', 'cloud', '{"Monday" : 12, "Tuesday" : 13, "Wednesday" : 13, "Thursday" : 13, "Friday" : 13}', 2 ),
		('Noah', 'Bailey', 'cloud', '{"Monday" : 14, "Tuesday" : 2, "Wednesday" : 12, "Thursday" : 12, "Friday" : 12}', 2 ),
		('Olivia', 'Rivera', 'cloud', '{"Monday" : 13, "Tuesday" :  14, "Wednesday" : 14, "Thursday" : 14, "Friday" : 14}', 2 ),
		('Mia', 'Murphy', 'cloud', '{"Monday" : 15, "Tuesday" : 15, "Wednesday" : 15, "Thursday" : 15, "Friday" : 15}', 2 ),
		('Liam', 'Bell', 'cloud', '{"Monday" : 26, "Tuesday" : 26, "Wednesday" : 26, "Thursday" : 26, "Friday" : 26}', 3 ),
		('Kelly', 'Morgan', 'cloud', '{"Monday" : 27, "Tuesday" : 27, "Wednesday" : 27, "Thursday" : 27, "Friday" : 27}', 3 ),
		('Jason', 'Cook', 'cloud', '{"Monday" : 28, "Tuesday" : 28, "Wednesday" : 28, "Thursday" : 28, "Friday" : 28}', 3 ),
		('Isla', 'Reed', 'cloud', '{"Monday" : 29, "Tuesday" : 29, "Wednesday" : 29, "Thursday" : 29, "Friday" : 29}', 3 ),
		('Howard', 'Rogers', 'cloud', '{"Monday" : 30, "Tuesday" : 30, "Wednesday" : 30, "Thursday" : 30, "Friday" : 30}', 3 ),
		('Gina', 'Morris', 'service', '{"Monday" : 52, "Tuesday" : 52, "Wednesday" : 52, "Thursday" : 52, "Friday" : 52}', 4 ),
		('Felix', 'Stewart', 'service', '{"Monday" : 53, "Tuesday" : 53, "Wednesday" : 53, "Thursday" : 53, "Friday" : 53}', 4 ),
		('Ella', 'Collins', 'service', '{"Monday" : 54, "Tuesday" : 54, "Wednesday" : 54, "Thursday" : 54, "Friday" : 54}', 4 ),
		('Daniel', 'Edwards', 'service', '{"Monday" : 55, "Tuesday" : 55, "Wednesday" : 55, "Thursday" : 55, "Friday" : 55}', 4 ),
		('Chloe', 'Evans', 'service', '{"Monday" : 56, "Tuesday" : 56, "Wednesday" : 56, "Thursday" : 56, "Friday" : 56}', 4 ),
		('Benjamin', 'Parker', 'service', '{"Monday" : 58, "Tuesday" : 58, "Wednesday" : 58, "Thursday" : 58, "Friday" : 58}', 5 ),
		('Abigail', 'Campbell', 'service', '{"Monday" : 59, "Tuesday" : 59, "Wednesday" : 59, "Thursday" : 59, "Friday" : 59}', 5 ),
		('Zachary', 'Phillips', 'service', '{"Monday" : 60, "Tuesday" : 60, "Wednesday" : 60, "Thursday" : 60, "Friday" : 60}', 5 ),
		('Yolanda', 'Roberts', 'service', '{"Monday" : 61, "Tuesday" : 61, "Wednesday" : 61, "Thursday" : 61, "Friday" : 61}', 5 ),
		('Xavier', 'Parez', 'service', '{"Monday" : 62, "Tuesday" : 62, "Wednesday" : 62, "Thursday" : 62, "Friday" : 62}', 5 ),
		('Wendy', 'Mitchell', 'service', '{"Monday" : 76, "Tuesday" : 76, "Wednesday" : 76, "Thursday" : 76, "Friday" : 76}', 6 ),
		('Victor', 'Carter', 'service', '{"Monday" : 77, "Tuesday" : 77, "Wednesday" : 77, "Thursday" : 77, "Friday" : 77}', 6 ),
		('Uma', 'Nelson', 'service', '{"Monday" : 78, "Tuesday" : 78, "Wednesday" : 78, "Thursday" : 78, "Friday" : 78}', 6 ),
		('Tina', 'Harris', 'service', '{"Monday" : 79, "Tuesday" : 79, "Wednesday" : 79, "Thursday" : 79, "Friday" : 79}', 6 ),
		('Samuel', 'Turner', 'service', '{"Monday" : 80, "Tuesday" : 80, "Wednesday" : 80, "Thursday" : 80, "Friday" : 80}', 6 ),
		('Rachel', 'Baker', 'cloud', '{"Monday" : 106, "Tuesday" : 106, "Wednesday" : 106, "Thursday" : 106, "Friday" : 106}', 7 ),
		('Quentin', 'Adams', 'cloud', '{"Monday" : 107, "Tuesday" : 107, "Wednesday" : 107, "Thursday" : 107, "Friday" : 107}', 7 ),
		('Patricia', 'Green', 'cloud', '{"Monday" : 108, "Tuesday" : 108, "Wednesday" : 108, "Thursday" : 108, "Friday" : 108}', 7 ),
		('Nancy', 'Wright', 'cloud', '{"Monday" : 109, "Tuesday" : 109, "Wednesday" : 109, "Thursday" : 109, "Friday" : 109}', 7 ),
		('Oliver', 'Scott', 'cloud', '{"Monday" : 110, "Tuesday" : 110, "Wednesday" : 110, "Thursday" : 110, "Friday" : 110}', 7 ),
		('Mary', 'King', 'cloud', '{"Monday" : 121, "Tuesday" : 121, "Wednesday" : 121, "Thursday" : 121, "Friday" : 121}', 8 ),
		('Larry', 'Young', 'cloud', '{"Monday" : 122, "Tuesday" : 122, "Wednesday" : 122, "Thursday" : 122, "Friday" : 122}', 8 ),
		('Karen', 'Hall', 'cloud', '{"Monday" : 123, "Tuesday" : 123, "Wednesday" : 123, "Thursday" : 123, "Friday" : 123}', 8 ),
		('John', 'Walker', 'cloud', '{"Monday" : 124, "Tuesday" : 124, "Wednesday" : 124, "Thursday" : 124, "Friday" : 124}', 8 ),
		('Henry', 'Clark', 'cloud', '{"Monday" : 125, "Tuesday" : 125, "Wednesday" : 125, "Thursday" : 125, "Friday" : 125}', 8 ),
		('Grace', 'Lee', 'cloud', '{"Monday" : 141, "Tuesday" : 141, "Wednesday" : 141, "Thursday" : 141, "Friday" : 141}', 9 ),
		('Emily', 'Wilson', 'cloud', '{"Monday" : 142, "Tuesday" : 142, "Wednesday" : 142, "Thursday" : 142, "Friday" : 142}', 9 ),
		('Charlie', 'Davis', 'cloud', '{"Monday" : 143, "Tuesday" : 143, "Wednesday" : 143, "Thursday" : 143, "Friday" : 143}', 9 ),
		('Ethan', 'Brooks', 'cloud', '{"Monday" : 144, "Tuesday" : 144, "Wednesday" : 144, "Thursday" : 144, "Friday" : 144}', 9 ),
		('Hannah', 'Foster', 'cloud', '{"Monday" : 145, "Tuesday" : 145, "Wednesday" : 145, "Thursday" : 145, "Friday" : 145}', 9 ),
		('Gina', 'Morris', 'service', '{"Monday" : 52, "Tuesday" : 52, "Wednesday" : 52, "Thursday" : 52, "Friday" : 52}', 10 ),
		('Felix', 'Stewart', 'service', '{"Monday" : 53, "Tuesday" : 53, "Wednesday" : 53, "Thursday" : 53, "Friday" : 53}', 10 ),
		('Ella', 'Collins', 'service', '{"Monday" : 54, "Tuesday" : 54, "Wednesday" : 54, "Thursday" : 54, "Friday" : 54}', 10 ),
		('Daniel', 'Edwards', 'service', '{"Monday" : 55, "Tuesday" : 55, "Wednesday" : 55, "Thursday" : 55, "Friday" : 55}', 10 ),
		('Chloe', 'Evans', 'service', '{"Monday" : 56, "Tuesday" : 56, "Wednesday" : 56, "Thursday" : 56, "Friday" : 56}', 10 ),
		('Benjamin', 'Parker', 'service', '{"Monday" : 58, "Tuesday" : 58, "Wednesday" : 58, "Thursday" : 58, "Friday" : 58}', 11 ),
		('Abigail', 'Campbell', 'service', '{"Monday" : 59, "Tuesday" : 59, "Wednesday" : 59, "Thursday" : 59, "Friday" : 59}', 11 ),
		('Zachary', 'Phillips', 'service', '{"Monday" : 60, "Tuesday" : 60, "Wednesday" : 60, "Thursday" : 60, "Friday" : 60}', 11 ),
		('Yolanda', 'Roberts', 'service', '{"Monday" : 61, "Tuesday" : 61, "Wednesday" : 61, "Thursday" : 61, "Friday" : 61}', 11 ),
		('Xavier', 'Parez', 'service', '{"Monday" : 62, "Tuesday" : 62, "Wednesday" : 62, "Thursday" : 62, "Friday" : 62}', 11 ),
		('Wendy', 'Mitchell', 'service', '{"Monday" : 76, "Tuesday" : 76, "Wednesday" : 76, "Thursday" : 76, "Friday" : 76}', 12 ),
		('Victor', 'Carter', 'service', '{"Monday" : 77, "Tuesday" : 77, "Wednesday" : 77, "Thursday" : 77, "Friday" : 77}', 12 ),
		('Uma', 'Nelson', 'service', '{"Monday" : 78, "Tuesday" : 78, "Wednesday" : 78, "Thursday" : 78, "Friday" : 78}', 12 ),
		('Tina', 'Harris', 'service', '{"Monday" : 79, "Tuesday" : 79, "Wednesday" : 79, "Thursday" : 79, "Friday" : 79}', 12 ),
		('Samuel', 'Turner', 'service', '{"Monday" : 80, "Tuesday" : 80, "Wednesday" : 80, "Thursday" : 80, "Friday" : 80}', 12 ),
		('Rachel', 'Baker', 'cloud', '{"Monday" : 106, "Tuesday" : 106, "Wednesday" : 106, "Thursday" : 106, "Friday" : 106}', 13 ),
		('Quentin', 'Adams', 'cloud', '{"Monday" : 107, "Tuesday" : 107, "Wednesday" : 107, "Thursday" : 107, "Friday" : 107}', 13 ),
		('Patricia', 'Green', 'cloud', '{"Monday" : 108, "Tuesday" : 108, "Wednesday" : 108, "Thursday" : 108, "Friday" : 108}', 13 ),
		('Nancy', 'Wright', 'cloud', '{"Monday" : 109, "Tuesday" : 109, "Wednesday" : 109, "Thursday" : 109, "Friday" : 109}', 13 ),
		('Oliver', 'Scott', 'cloud', '{"Monday" : 110, "Tuesday" : 110, "Wednesday" : 110, "Thursday" : 110, "Friday" : 110}', 13 ),
		('Mary', 'King', 'cloud', '{"Monday" : 121, "Tuesday" : 121, "Wednesday" : 121, "Thursday" : 121, "Friday" : 121}', 14 ),
		('Larry', 'Young', 'cloud', '{"Monday" : 122, "Tuesday" : 122, "Wednesday" : 122, "Thursday" : 122, "Friday" : 122}', 14 ),
		('Karen', 'Hall', 'cloud', '{"Monday" : 123, "Tuesday" : 123, "Wednesday" : 123, "Thursday" : 123, "Friday" : 123}', 14 ),
		('John', 'Walker', 'cloud', '{"Monday" : 124, "Tuesday" : 124, "Wednesday" : 124, "Thursday" : 124, "Friday" : 124}', 14 ),
		('Henry', 'Clark', 'cloud', '{"Monday" : 125, "Tuesday" : 125, "Wednesday" : 125, "Thursday" : 125, "Friday" : 125}', 14 ),
		('Grace', 'Lee', 'cloud', '{"Monday" : 141, "Tuesday" : 141, "Wednesday" : 141, "Thursday" : 141, "Friday" : 141}', 15 ),
		('Emily', 'Wilson', 'cloud', '{"Monday" : 142, "Tuesday" : 142, "Wednesday" : 142, "Thursday" : 142, "Friday" : 142}', 15 ),
		('Charlie', 'Davis', 'cloud', '{"Monday" : 143, "Tuesday" : 143, "Wednesday" : 143, "Thursday" : 143, "Friday" : 143}', 15 ),
		('Ethan', 'Brooks', 'cloud', '{"Monday" : 144, "Tuesday" : 144, "Wednesday" : 144, "Thursday" : 144, "Friday" : 144}', 15 ),
		('Hannah', 'Foster', 'cloud', '{"Monday" : 145, "Tuesday" : 145, "Wednesday" : 145, "Thursday" : 145, "Friday" : 145}', 15 );

--This trigger is to update seats of the employees when HOE changes seats allocated to manager
-- Step 1: Create the function
CREATE OR REPLACE FUNCTION update_seat_data() RETURNS TRIGGER AS $$
DECLARE
    seat INT;
    day TEXT;
BEGIN
    -- Loop through each seat in the OLD seats_array
    FOREACH seat IN ARRAY OLD.seats_array
    LOOP
        -- Check if the seat is in the NEW seats_array
        IF NOT seat = ANY(NEW.seats_array) THEN
            -- If the seat is not in the NEW seats_array, update the seat_data in employee_allocation
            FOR day IN SELECT jsonb_object_keys(seat_data) FROM employee_allocation WHERE manager_id = OLD.id
            LOOP
                -- Update the seat_data to "WFH" if the seat matches
                UPDATE employee_allocation
                SET seat_data = jsonb_set(seat_data, ARRAY[day], '"WFH"')
                WHERE manager_id = OLD.id AND seat_data ->> day = seat::TEXT;
            END LOOP;
        END IF;
    END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Create the trigger
CREATE TRIGGER update_seat_data_trigger
AFTER UPDATE OF seats_array ON manager_allocation
FOR EACH ROW
EXECUTE FUNCTION update_seat_data();