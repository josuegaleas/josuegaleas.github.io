/*
 * Author: Josue Galeas
 * Last Edit: 2019.04.11
 */

// Maps for associating inputs to integers
var colorMap = [];
colorMap["White"] = 0;
colorMap["Green"] = 1;
colorMap["Blue"] = 2;
colorMap["Yellow"] = 3;

var itemMap = [];
itemMap["Armor"] = 0;
itemMap["Weapon"] = 1;
itemMap["Accessory"] = 2;

var enhanceMap = [];
enhanceMap["+6"] = 0;
enhanceMap["+7"] = 1;
enhanceMap["+8"] = 2;
enhanceMap["+9"] = 3;
enhanceMap["+10"] = 4;
enhanceMap["+11"] = 5;
enhanceMap["+12"] = 6;
enhanceMap["+13"] = 7;
enhanceMap["+14"] = 8;
enhanceMap["+15"] = 9;
enhanceMap["PRI"] = 10;
enhanceMap["DUO"] = 11;
enhanceMap["TRI"] = 12;
enhanceMap["TET"] = 13;
enhanceMap["PEN"] = 14;

// Setting up three-dimensional array
var bases = new Array(4);
for (i = 0; i < 4; i++)
{
	bases[i] = new Array(3);

	for (j = 0; j < 3; j++)
	{
		bases[i][j] = new Array(15);

		for (k = 0; k < 15; k++)
			bases[i][j][k] = "Not Applicable";
	}
}

// Function that gets base percentage
function getBase(item, enhance)
{
	var foo = item.split(" ");
	colorIndex = colorMap[foo[0]];
	itemIndex = itemMap[foo[1]];
	enhanceIndex = enhanceMap[enhance];

	return bases[colorIndex][itemIndex][enhanceIndex];
}

// Function that sets base percentage
function setBase(item, enhance, value)
{
	var foo = item.split(" ");
	colorIndex = colorMap[foo[0]];
	itemIndex = itemMap[foo[1]];
	enhanceIndex = enhanceMap[enhance];

	bases[colorIndex][itemIndex][enhanceIndex] = value;
}

// Function that gets soft-cap percentage
function getSoft(item, enhance)
{
	if (item == "Yellow Accessory")
	{
		switch (enhance)
		{
			case "DUO":
				return 50.0;
			case "TRI":
				return 40.0;
			case "TET":
				return 30.0;
			case "PEN":
				// Speculation; need beyond a 390 stack to confirm.
				return 20.0;
			default:
				return 70.0;
		}
	}
	else
		return 70.0;
}

// Assigning known base percentages
setBase("Yellow Armor", "+6", 70.00);
setBase("Yellow Armor", "+7", 25.64);
setBase("Yellow Armor", "+8", 17.24);
setBase("Yellow Armor", "+9", 11.76);
setBase("Yellow Armor", "+10", 7.69);
setBase("Yellow Armor", "+11", 6.25);
setBase("Yellow Armor", "+12", 5.00);
setBase("Yellow Armor", "+13", 4.00);
setBase("Yellow Armor", "+14", 2.86);
setBase("Yellow Armor", "+15", 2.00);
setBase("Yellow Armor", "PRI", 11.76);
setBase("Yellow Armor", "DUO", 7.69);
setBase("Yellow Armor", "TRI", 6.25);
setBase("Yellow Armor", "TET", 2.00);
setBase("Yellow Armor", "PEN", 0.30);

setBase("Yellow Weapon", "+8", 70.00);
setBase("Yellow Weapon", "+9", 20.41);
setBase("Yellow Weapon", "+10", 14.29);
setBase("Yellow Weapon", "+11", 10.00);
setBase("Yellow Weapon", "+12", 6.67);
setBase("Yellow Weapon", "+13", 4.00);
setBase("Yellow Weapon", "+14", 2.50);
setBase("Yellow Weapon", "+15", 2.00);
setBase("Yellow Weapon", "PRI", 11.76);
setBase("Yellow Weapon", "DUO", 7.69);
setBase("Yellow Weapon", "TRI", 6.25);
setBase("Yellow Weapon", "TET", 2.00);
setBase("Yellow Weapon", "PEN", 0.30);

setBase("Yellow Accessory", "PRI", 25.00);
setBase("Yellow Accessory", "DUO", 10.00);
setBase("Yellow Accessory", "TRI", 7.50);
setBase("Yellow Accessory", "TET", 2.50);
setBase("Yellow Accessory", "PEN", 0.50);

// Function that iteratively calculates chance
function calculateChance(base, stack, soft)
{
	if (stack == 0)
		return base;
	var chance = base;

	// If below soft-cap, add 10% of base
	while (chance < soft && stack > 0)
	{
		chance += base * 0.1;
		stack--;
	}

	// If below 90% and above soft-cap, add 2% of base
	while (chance < 90.0 && stack > 0)
	{
		chance += base * 0.02;
		stack--;

		if (chance >= 90.0)
			chance = 90.0;
	}

	return chance;
}

// Function that gets user's inputs and displays enhance chance
function displayChance()
{
	var item = document.getElementById("item").value;
	var enhance = document.getElementById("enhance").value;
	var stack = document.getElementById("stack").value;

	// Check if stack is a non-negative integer
	if (isNaN(Number(stack)))
	{
		document.getElementById("chance").innerHTML = "Stack is not a number.";
		return;
	}
	else if (Number(stack) < 0)
	{
		document.getElementById("chance").innerHTML = "Stack can't be negative.";
		return;
	}

	// Check if enhance is even possible
	var base = getBase(item, enhance);
	if (base == "Not Applicable")
	{
		document.getElementById("chance").innerHTML = base;
		return;
	}

	// Calculate and format enhance chance for displaying
	var soft = getSoft(item, enhance);
	var chance = calculateChance(base, stack, soft);
	var result = chance.toFixed(2) + '%'

	if (chance >= 90.0)
		result += " (Hard-capped)"
	else if (chance >= soft)
		result += " (Soft-capped)"

	document.getElementById("chance").innerHTML = result;
}

displayChance();
