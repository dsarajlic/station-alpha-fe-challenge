# API Integration Challenge - Questions

Please answer the following questions about your weather application implementation:

1. **API Implementation**: Describe your approach to integrating the weather API:
   - Which API did you choose and why?

     I initially chose to use OpenWeatherAPI as it seemed relatively comprehensive, despite requiring to parse out lat/long from the location. As I worked my way through the required tasks I found myself being unable to use the Alerts API (as it required a separate API endpoint). As such I also found myself having to use the Weather API. 
     
     I also moved out all the API keys to a .env file and provided a env template, so its indicative what is required to get a functioning application.

   - How did you structure your API service layer?

     I leveraged what was already there and used the weatherApi.ts file. Alongside the functions I also combined the relevant ts file (for transformWeatherData function), as it made sense to keep them together. Furthermore, it was scarcely used elsewhere.

   - How did you handle error cases and rate limiting?
     
     I tried to accomodate all the relevant functions safely by using try/catch where possible and I used debounce where I saw fit. Within the SearchBar.ts file I also added an additional debounce for the query, alongside the suggestions.
    

2. **User Experience**: Explain your key UX decisions:
   - How did you present the weather data effectively?
     
     I made minor improvements to the CSS styles, so it presents nicely on desktop and mobile. I tried to use what was there without deviating too much.

   - How did you handle loading states and errors?

     I included text to indicate when suggestions are loading or when they cant be found. Furthermore every endpoint has their respective error handlers and presents nicely if a single endpoint fails.

   - What accessibility features did you implement?

     I put special emphasis on the suggestions and list items produced, including aria-labels and role(s) where it made sense. I also ensured there is a sane tabbing order and that the focus outline is visible on the focused element(s). This is predominantly to help all those with visual impairements or for people who use a screen reader.

3. **Technical Decisions**: What were your main technical considerations?
   - How did you optimize API calls and performance?
     
     As I mentioned above, I used debounce(s) predominantly for both the query and the suggestions. I added a 300ms debounce, so it still feels responsive without thrashing the API on every keystroke.

   - How did you handle state management?

     I used React's useState predominantly as the app follows a centralized pattern, where the parent passes state to its child components. useState lends itself quite well to this way of working.

   - How did you ensure the application works well across different devices?

     I used the native browser functionality to test the various sizes, alongside the emulate tool to test specific make/models of devices. I think the outcome is a somewhat sane default, but given enough time I would try to get this to look far better.

4. **Challenges**: What was the most challenging aspect of this project and how did you overcome it?

    It took me some time to fully understand the project requirements and expectations, especially since you could easily spend a lot of effort refining different parts of the application (such as adding stricter type checking or improving error messages).

    That said, the most challenging aspect was parsing the data so it fit the structure of the transformWeatherData object. More broadly, it was also about identifying the right endpoints that provide the necessary data without incurring costs. For example, my current Weather Map implementation is incomplete because I haven’t found a free-tier source that includes precipitation data.

5. **Improvements**: If you had more time, what would be the top 2-3 improvements you would make to the application? 

    1. As mentioned above, I'm currently not necessarily happy with how the product looks: whilst the four quadrants make sense, the various sizes of the components within these quadrants make for a rather chaotic look. The components don't have consistent proportions, which creates a disjointed look rather than a cohesive dashboard.
    
    2. Moving out the API layer to the server would have some benefits and you could employ other, arguably better ways of caching.

    3. Implement a more sophisticated state management solution using React Query or SWR. This would provide better data synchronization, automatic background refetching etc. It would also help with managing the complex relationships between current weather, forecast and alerts.