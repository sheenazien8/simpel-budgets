<?php

namespace App\Enums;

enum RecapBy: string
{
    case Last7Days = '7 days';
    case Last30Days = '30 days';
    case AMonth = '1 month';
    case ThreeMonth = '3 month';
}
