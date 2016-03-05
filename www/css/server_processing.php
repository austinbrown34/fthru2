<?php

/*
 * DataTables example server-side processing script.
 *
 * Please note that this script is intentionally extremely simply to show how
 * server-side processing can be implemented, and probably shouldn't be used as
 * the basis for a large complex system. It is suitable for simple use cases as
 * for learning.
 *
 * See http://datatables.net/usage/server-side for full details on the server-
 * side processing requirements of DataTables.
 *
 * @license MIT - http://datatables.net/license_mit
 */

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Easy set variables
 */

// DB table to use
$table = 'contacts';

// Table's primary key
$primaryKey = 'id';

// Array of database columns which should be read and sent back to DataTables.
// The `db` parameter represents the column name in the database, while the `dt`
// parameter represents the DataTables column identifier. In this case simple
// indexes
$columns = array(
    array( 'db' => 'first', 'dt' => 0 ),
    array( 'db' => 'phone',  'dt' => 1 ),
    array( 'db' => 'type',   'dt' => 2 )

);

// SQL server connection information
$sql_details = array(
    'user' => 'austinbrown34',
    'pass' => 'eJ32IRQb#RspD51ZQ&a#',
    'db'   => 'austinbr_cpr',
    'host' => 'localhost'
);

?>