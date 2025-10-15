import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

export default function AccountsList({ accountsArray }) {
  return (
    <>
      <Table hoverable>
        <TableHead>
          <TableRow>
            <TableHeadCell></TableHeadCell>
            <TableHeadCell>First Name</TableHeadCell>
            <TableHeadCell>Last Name</TableHeadCell>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>Account Status</TableHeadCell>
            <TableHeadCell></TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {accountsArray.map(
            ({ first_name, last_name, email, status }, index) => {
              return (
                <TableRow key={index} className="border-b last:border-b-0">
                  <TableCell>
                    <input type="checkbox"></input>
                  </TableCell>
                  <TableCell>{first_name}</TableCell>
                  <TableCell>{last_name}</TableCell>
                  <TableCell>{email}</TableCell>
                  <TableCell>
                    <span className="bg-yellow-200 px-4 py-2 text-yellow-500 rounded-sm">
                      {status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button className="border border-blue-700 py-2 px-3 rounded-md bg-blue-500 text-blue-100">
                      Confirm
                    </button>
                  </TableCell>
                </TableRow>
              );
            }
          )}
        </TableBody>
      </Table>
    </>
  );
}
