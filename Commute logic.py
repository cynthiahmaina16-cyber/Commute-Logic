# --- Step 1: Create the variables ---
distance_mi = 10
is_raining = True
has_bike = False
has_car = False
has_ride_share_app = True

# --- Step 2: Continuous conditional evaluation in ascending order ---

# Rule 1: Check for falsy distance (e.g., 0)
if not distance_mi:
    print(False)

# Rule 2: Less than or equal to 1 mile
elif distance_mi <= 1:
    print(not is_raining)

# Rule 3: Greater than 1 mile and less than or equal to 6 miles
elif distance_mi <= 6:
    print(has_bike and not is_raining)

# Rule 4: Greater than 6 miles
else:
    print(has_car or has_ride_share_app)
