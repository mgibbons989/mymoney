CREATE TABLE employees (
  employeeID INT NOT NULL,
  firstName VARCHAR(30) NOT NULL,
  lastName VARCHAR(30) NOT NULL,
  email VARCHAR(30) NOT NULL,
  password VARCHAR(30) NOT NULL,
  PRIMARY KEY (employeeID)
);

CREATE TABLE positions (
  positionsID INT NOT NULL,
  wage DECIMAL(3,2) NOT NULL,
  PRIMARY KEY (positionsID)
);

CREATE TABLE payroll (
  payrollID INT NOT NULL,
  payPeriodStart DATE NOT NULL,
  payPeriodEnd DATE NOT NULL,
  totalHoursWorked INT NOT NULL,
  hourlyRate DECIMAL(3,2) NOT NULL,
  PRIMARY KEY (payrollID)
);

