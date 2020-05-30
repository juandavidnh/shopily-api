 CREATE TABLE shopily_shopping_list (
     user_id INTEGER REFERENCES shopily_users(id),
     item_id INTEGER REFERENCES shopily_item_list(id),
     date_added TIMESTAMP NOT NULL DEFAULT now(),
     PRIMARY KEY (user_id, item_id)
 );