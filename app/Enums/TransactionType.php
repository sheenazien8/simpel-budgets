<?php

namespace App\Enums;

enum TransactionType: int
{
    case Expense = 1;
    case Income = 2;
    case Transfer = 3;
}
