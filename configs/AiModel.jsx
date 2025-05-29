const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generateConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const GenerateCourseLayout_AI = model.startChat({
  generateConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate A Course Tutorial on Following Detail With field as Course Name, Description, Along with Chapter Name, about, Duration: Category: 'Programming'. Topic: Python, Level: Basic, Duration: 1 hours, NoOfChapters:5, in JSON format",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "course": {\n    "name": "Python Fundamentals in 1 Hour",\n    "description": "This course provides a quick and essential introduction to the Python programming language, designed specifically for absolute beginners with no prior programming experience. You will learn the basic syntax, data types, variables, simple operators, conditional statements, and introductory loops. By the end of this compact 1-hour session, you will grasp the core concepts needed to write basic Python scripts.",\n    "chapters": [\n      {\n        "name": "Chapter 1: Your First Python Steps",\n        "about": "Introduction to Python, why it\'s popular, setting up a simple coding environment (e.g., online interpreter), and writing your first \'Hello, World!\' program.",\n        "duration": "10 minutes"\n      },\n      {\n        "name": "Chapter 2: Storing Data: Variables & Types",\n        "about": "Learn how to create variables to store information. Introduction to fundamental data types: integers (numbers), strings (text), and booleans (True/False).",\n        "duration": "15 minutes"\n      },\n      {\n        "name": "Chapter 3: Basic Operations and Interaction",\n        "about": "Covers essential arithmetic operators (+, -, *, /), comparison operators (==, !=, <, >), and how to display output using `print()` and receive input using `input()`.",\n        "duration": "10 minutes"\n      },\n      {\n        "name": "Chapter 4: Making Choices: If Statements",\n        "about": "Learn how to make decisions in your code using `if`, `elif`, and `else` statements to control the flow of execution based on conditions.",\n        "duration": "10 minutes"\n      },\n      {\n        "name": "Chapter 5: Repeating Code: Basic Loops",\n        "about": "An introduction to repeating tasks using loops. Covers the basics of `for` loops (e.g., iterating a specific number of times) and `while` loops.",\n        "duration": "15 minutes"\n      }\n    ],\n    "category": "Programming",\n    "topic": "Python",\n    "level": "Basic",\n    "duration": "1 hour",\n    "numberOfChapters": 5\n  }\n}\n```',
        },
      ],
    },
  ],
});

export const GenerateChapterContent_AI = model.startChat({
    generateConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Explain the concept in detail on the topic: Python Basics, Chapter: Variables and Data Types, in JSON format. Provide a list (array) with fields: title, explanation (detailed), and code example (code field in <precode> format if applicable).",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: `\`\`\`json
      {
        "topic": "Python Basics",
        "chapter": "Variables and Data Types",
        "details": [
          {
            "title": "What are Variables?",
            "explanation": "In Python, a variable is like a container or a labeled box where you can store data values. Instead of referring to the data directly, you use the variable's name to access or modify it. This makes code more readable and reusable. Variables are created the moment you first assign a value to them. You don't need to declare the type of a variable in advance (this is called dynamic typing).",
            "Code Example": "<precode># Assigning the value 10 to a variable named 'age'\\nage = 10\\n\\n# Assigning the string \\"Alice\\" to a variable named 'name'\\nname = \\"Alice\\"\\n\\n# Using the variables\\nprint(name)  # Output: Alice\\nprint(age)   # Output: 10\\n\\n# Variables can be reassigned to different values (and even different types)\\nage = 11\\nprint(age)   # Output: 11\\n\\nage = \\"Eleven\\" # Now 'age' holds a string\\nprint(age)   # Output: Eleven</precode>"
          },
          {
            "title": "Variable Naming Rules and Conventions",
            "explanation": "Python has specific rules for naming variables:\\n1.  **Must start with a letter (a-z, A-Z) or an underscore (_).**\\n2.  **Cannot start with a number (0-9).**\\n3.  **Can only contain alpha-numeric characters (a-z, A-Z, 0-9) and underscores (_).**\\n4.  **Variable names are case-sensitive** (\`age\`, \`Age\`, and \`AGE\` are three different variables).\\n5.  **Cannot be a Python keyword** (like \`if\`, \`else\`, \`while\`, \`def\`, \`class\`, \`True\`, \`False\`, \`None\`, etc.).\\n\\n**Conventions (Good Practices):**\\n*   Use descriptive names (e.g., \`user_name\` instead of \`un\`).\\n*   Use \`snake_case\` (all lowercase words separated by underscores) for variable names (e.g., \`first_name\`, \`item_count\`).\\n*   Avoid using single letters like \`l\`, \`O\`, \`I\` as they can be confused with numbers \`1\` and \`0\`.",
            "Code Example": "<precode># Valid variable names\\nmy_variable = 1\\n_count = 5\\nuser_name = \\"Bob\\"\\nlevel9 = \\"Expert\\"\\n\\n# Invalid variable names (will cause errors)\\n# 2nd_variable = 2  # Starts with a number\\n# user-name = \\"Sue\\" # Contains a hyphen\\n# class = \\"Warrior\\" # 'class' is a keyword\\n\\n# Case sensitivity example\\nfruit = \\"Apple\\"\\nFruit = \\"Orange\\"\\nprint(fruit)  # Output: Apple\\nprint(Fruit) # Output: Orange</precode>"
          },
          {
            "title": "What are Data Types?",
            "explanation": "Data types define the kind of data a variable can hold and what operations can be performed on that data. Python has several built-in data types. Because Python is dynamically typed, the interpreter automatically determines the data type of a variable based on the value assigned to it. You don't need to explicitly declare the type.",
            "Code Example": "<precode># Python infers the data type automatically\\n\\ncount = 10          # 'count' is automatically an integer (int)\\nprice = 19.99       # 'price' is automatically a floating-point number (float)\\nmessage = \\"Hello\\"   # 'message' is automatically a string (str)\\nis_active = True    # 'is_active' is automatically a boolean (bool)\\n\\n# You can check the type using the type() function\\nprint(type(count))    # Output: <class 'int'>\\nprint(type(price))    # Output: <class 'float'>\\nprint(type(message))  # Output: <class 'str'>\\nprint(type(is_active))# Output: <class 'bool'></precode>"
          },
          {
            "title": "Common Built-in Data Types",
            "explanation": "Here are some of the most fundamental data types in Python:\\n\\n*   **Text Type:** \`str\` (String) - Represents sequences of characters, enclosed in single (' '), double (\\" \\"), or triple (''' ''' or \\"\\"\\" \\"\\"\\") quotes.\\n*   **Numeric Types:**\\n    *   \`int\` (Integer) - Represents whole numbers (positive, negative, or zero) without decimals.\\n    *   \`float\` (Floating-Point Number) - Represents numbers with a decimal point or in exponential (E) notation.\\n*   **Sequence Types:**\\n    *   \`list\` - Ordered, mutable (changeable) sequence of items. Enclosed in square brackets \`[]\`.\\n    *   \`tuple\` - Ordered, immutable (unchangeable) sequence of items. Enclosed in parentheses \`()\`.\\n*   **Mapping Type:** \`dict\` (Dictionary) - Unordered collection of key-value pairs. Enclosed in curly braces \`{}\`.\\n*   **Set Types:**\\n    *   \`set\` - Unordered collection of unique items. Enclosed in curly braces \`{}\`.\\n    *   \`frozenset\` - Immutable version of a set.\\n*   **Boolean Type:** \`bool\` - Represents truth values, either \`True\` or \`False\`.\\n*   **None Type:** \`NoneType\` - Represents the absence of a value. Has only one possible value: \`None\`.",
            "Code Example": "<precode># String (str)\\nmy_string = \\"Python is fun!\\"\\nprint(f\\"String: {my_string}, Type: {type(my_string)}\\")\\n\\n# Integer (int)\\nmy_int = -50\\nprint(f\\"Integer: {my_int}, Type: {type(my_int)}\\")\\n\\n# Float (float)\\nmy_float = 3.14159\\nprint(f\\"Float: {my_float}, Type: {type(my_float)}\\")\\n\\n# List (list) - mutable\\nmy_list = [1, \\"apple\\", 3.5, True]\\nprint(f\\"List: {my_list}, Type: {type(my_list)}\\")\\nmy_list[1] = \\"banana\\" # Lists can be changed\\nprint(f\\"Modified List: {my_list}\\")\\n\\n# Tuple (tuple) - immutable\\nmy_tuple = (1, \\"apple\\", 3.5, True)\\nprint(f\\"Tuple: {my_tuple}, Type: {type(my_tuple)}\\")\\n# my_tuple[1] = \\"banana\\" # This would cause an error: TypeError\\n\\n# Dictionary (dict)\\nmy_dict = {\\"name\\": \\"Charlie\\", \\"age\\": 30, \\"city\\": \\"New York\\"}\\nprint(f\\"Dictionary: {my_dict}, Type: {type(my_dict)}\\")\\nprint(f\\"Name from dict: {my_dict['name']}\\")\\n\\n# Set (set) - unique items, unordered\\nmy_set = {1, 2, 2, 3, 4, 4, 4}\\nprint(f\\"Set: {my_set}, Type: {type(my_set)}\\")\\n\\n# Boolean (bool)\\nis_student = False\\nprint(f\\"Boolean: {is_student}, Type: {type(is_student)}\\")\\n\\n# NoneType (None)\\nno_value = None\\nprint(f\\"NoneType: {no_value}, Type: {type(no_value)}\\")</precode>"
          },
          {
            "title": "Type Conversion (Casting)",
            "explanation": "Sometimes you need to convert a value from one data type to another. This is called type casting or type conversion. Python provides built-in functions for this, like \`int()\`, \`float()\`, \`str()\`, \`list()\`, \`tuple()\`, \`set()\`, \`dict()\`.\\n\\n*   \`int(x)\`: Converts \`x\` to an integer. \`x\` can be a float (truncates decimal) or a string representing a whole number.\\n*   \`float(x)\`: Converts \`x\` to a float. \`x\` can be an integer or a string representing a number (integer or decimal).\\n*   \`str(x)\`: Converts \`x\` to a string representation.\\n*   \`list(x)\`, \`tuple(x)\`, \`set(x)\`: Convert an iterable \`x\` (like a string, tuple, list, set) into a list, tuple, or set respectively.\\n\\nBe careful: Not all conversions are possible (e.g., converting the string \\"hello\\" to an integer will raise a \`ValueError\`).",
            "Code Example": "<precode># Example: Converting between numeric types\\nnum_int = 100\\nnum_float = float(num_int)\\nprint(f\\"Integer {num_int} as float: {num_float}, Type: {type(num_float)}\\")\\n\\nnum_float_val = 99.9\\nnum_int_val = int(num_float_val)\\nprint(f\\"Float {num_float_val} as int: {num_int_val}, Type: {type(num_int_val)}\\")\\n\\n# Example: Converting string to numbers\\nstr_num = \\"123\\"\\nint_from_str = int(str_num)\\nfloat_from_str = float(str_num)\\nprint(f\\"String '{str_num}' as int: {int_from_str}, Type: {type(int_from_str)}\\")\\nprint(f\\"String '{str_num}' as float: {float_from_str}, Type: {type(float_from_str)}\\")\\n\\n# Example: Converting numbers to string\\nnumber = 42\\nstr_from_num = str(number)\\nprint(f\\"Number {number} as string: '{str_from_num}', Type: {type(str_from_num)}\\")\\n\\n# Example: Converting sequence types\\nmy_tuple_seq = (1, 2, 3)\\nmy_list_seq = list(my_tuple_seq)\\nprint(f\\"Tuple {my_tuple_seq} as list: {my_list_seq}, Type: {type(my_list_seq)}\\")\\n\\nmy_list_items = ['a', 'b', 'c', 'a']\\nmy_set_items = set(my_list_items)\\nprint(f\\"List {my_list_items} as set: {my_set_items}, Type: {type(my_set_items)}\\")\\n\\n# Example: Invalid conversion\\ntry:\\n    invalid_int = int(\\"hello\\")\\nexcept ValueError as e:\\n    print(f\\"Error converting 'hello' to int: {e}\\")</precode>"
          }
        ]
      }
      \`\`\``,
        },
      ],
    },
  ],
});


