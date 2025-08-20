# Bug Hunting Challenge - Questions

Please answer the following questions about the bugs you identified and fixed:

1. **Bug Overview**: List the bugs you found and fixed. For each bug, briefly describe:
   - What was the issue?
   - How did you identify it?
   - How did you fix it?

   **TodoForm**
   * "Uncaught ReferenceError: e is not defined at TodoForm" error appeared on Browser runtime
      * I created a handleChange function that accepts an event parameter. I prefer avoiding inline arrow functions for performance reasons (e.g., to prevent creating a new function on every render). While it wasn't strictly necessary here, I consider it good practice.

   * Type error "Binding element 'onAdd' implicitly has an 'any'" type error appeared within VSCode
      * I modified the default value to empty string and added relevant type annotation

   * onAdd Type error of "Binding element 'onAdd' implicitly has an 'any' type" appeared within VSCode
      * Added a type definition to onAdd. Looking at the wider app (App.tsx) and it looks to take a string and return nothing

   * handleSubmit was submitting (and hence reloading page) as is the default behaviour for a form (as noticed on browser)
      * Added e.preventDefault() to prevent this behaviour

   * On submission the text would stay within the input field (on the browser)
      * I have cleared it on submission, making the experience much nicer.

   **TodoList**
      * Type error within VSCode of "Parameter 'todo' implicitly has an 'any' type"
         * The component was missing types. I also noticed Todo type definition could be used in App.tsx, as opposed to duplicating code, I've added a dedicated types file. This is not necessary in this instance, but its generally good practice.  

      * Property 'complete' does not exist on type 'Todo'. Did you mean 'completed' type error appeared, within VSCode
         * Wrong property name pointed out by a Type error. I have corrected to use 'completed'.

      * "Argument of type 'Todo' is not assignable to parameter of type 'string'" error appeared within browser
         * Looking at the parent and I noticed it expects a parameter of id. I corrected to use todo.id

      * Type 'void' is not assignable to type 'MouseEventHandler<HTMLButtonElement> | undefined'. appeared as on the onDelete function, within VSCode
         * It was being called directly. I have since modified it to use a callback

      * Error appeared in Browser: "hook.js:608 Each child in a list should have a unique "key" prop"
         * Used relevant id (todo.id) for the list. This is to provide each item with a unique identifier.

      

   **ToDoFilter**
      * Immediately Type errors are evident for the props of TodoFilter, within VSCode 
         * Write related prop types and use as required

      * Parameter 'newFilter' implicitly has an 'any' type error within editor
         * Added a string type annotation

      * Type error appeared on className within editor: Type 'false | "active"' is not assignable to type 'string | undefined'.
         * Added a ternary operator, to allow for both "active" and false states

      * Type error suggesting "Cannot find name 'active'." within editor
         * Changed it to compare directly to string, instead of an nonexistent prop / variable 
      
      * Noticed the Completed button using a loose comparison operator
         * Modified to use an strict equality operator

      * The clear-completed button has a Type error issue within my editor
         * Looking at the parent and I noticed its simply a function, since it doesnt require any parameters (otherwise a callback would be appropriate) I opted to use a function reference instead, by removing the brackets

   **App**
      * Property 'onAdd' is missing in type '{}' but required in type 'TodoProps'.ts(2741);
      TodoForm.tsx(4, 3): 'onAdd' is declared here.
         * The TodoForm was expecting a onAdd prop, I added the function prop addTodo
         
      * TypeError: Parameter 'text' implicitly has an 'any' type.ts(7006) appeared in VSCode
         * I added a string type to the parameter

      * Type error of 'todos' is possibly 'null, within VSCode
         * Leveraged the Todos type from my types file, with the addition of making sure its an array of Todo objects. Added ([]) to ensure initial state is an empty array.

      * Types error: Property 'id' is missing in type '{ text: string; completed: false; }' but required in type 'Todo'. within VSCode
         * Typically I have used a library for this task: to generate a random string UUID. For the time being I have used times stamp based ID.
      
      * toggleTodo "Parameter 'id' implicitly has an 'any' type." Type error encountered in VSCode
         * Added string type annotation

      * deleteTodo "Cannot find name 'id'" within VSCode
         * Added id as a param within deleteTodo and added relevant type annotation

      * Type error appeared on TodoFilter in VSCode (Property 'onFilter' is missing in type '{ filter: string; onClearCompleted: () => void; }' but required in type 'TodoFilterProps'.)
         * Added relevant function prop and passed in setFilter


2. **Technical Approach**: What debugging tools and techniques did you use to identify and fix the bugs?

   I predominantly used the Type errors provided by Typescript (within VSCode) in combination with the runtime error(s) provided by the browser (Chrome / Firefox). Furthermore, manual testing is always useful, by either hovering over the function/code to see what is the expected type and or by looking at the parent for clues as to which type the children might be expecting. If need be, I would have also used console logs and stack traces to debug runtime errors, but it wasn't required in this instance.

3. **Code Improvements**: Beyond fixing bugs, did you make any improvements to the code organization or structure? If so, what and why?

   * Much in the same vein as my Todo types, I added an enums file that I could leverage across different components (TodoList, App.tsx). If there are *many* options I have issues with enums, but in this instance it was pretty convenient with only a few (all, active, completed).

   * I added an explicit types file, so we could reuse the Todo types. I generally have a discussion with the team surrounding *when* we should include simple types in the file(s) as opposed to having dedicated files.

   * I have modified filteredTodos to useMemo, so it only re-renders when its dependencies change. 

   * I modified how the toggleTodo function was done, as it was doing something very similar to how addTodo and it was modifying state directly. It didnt seem to cause any visible issues, but better to be safe.

   * I added a simple CSS gap between the filter options and the Clear completed. I thought it looked strange.

4. **Future Prevention**: How would you prevent similar bugs in future development? Consider both coding practices and testing strategies.

   * Ideally the only time you would find yourself in a scenario like this: where **many** errors are showing up concurrently is when you have recently decided to implement TS across your project. To prevent such issues, implement TypeScript from the start of a project or migrate incrementally, one component at a time. 
   Strongly typing everything is ideal -- no any.
   * Having explicit or verbal 'contracts' with the team implementing the API can also do wonders, as you can agree on certain aspects (eg. how the ids will be generated).


5. **Learning**: What was the most challenging or interesting aspect of this bug-hunting exercise? 

   It was comprehensive, it touches on many aspects of programming and with the requirement of also having to write it down, which ensures the person didnt simply use external assistance. 