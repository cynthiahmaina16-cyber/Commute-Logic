# Travel Weather Planner

A streamlined Python application designed to evaluate multi-tiered environmental conditions and transit availability to determine if a travel commute is feasible. 

##  Transit Evaluation Matrix

The script reviews logic parameters in **ascending order** of distance to output a direct boolean value (`True` or `False`):

| Distance Category | Condition Required for Success | Output |
| :--- | :--- | :--- |
| **0 Miles / Falsy** | Instantly fails validation | `False` |
| **≤ 1 Mile** | Must **not** be raining | `True` / `False` |
| **> 1 and ≤ 6 Miles** | Must have a bike **and** must **not** be raining | `True` / `False` |
| **> 6 Miles** | Must have a car **or** a ride-share app | `True` / `False` |

##  Core Concepts Practiced

- **Ascending Evaluation Hierarchy**: Structuring conditions continuously so Python evaluates spatial constraints efficiently without redundant checks.
- **Short-Circuit Boolean Evaluation**: Leveraging compound logical operators (`and`, `or`, `not`) to reduce nested code paths.
- **Strict Data Standards**: Printing actual programmatic Boolean states (`True`/`False`) rather than standard text strings.

   ```
3. Run the script using the Python CLI engine:
   ```bash
   python travel_weather_planner.py
   ```
