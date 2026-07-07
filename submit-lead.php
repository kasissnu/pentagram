<?php
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success"=>false,"response"=>"Method Not Allowed"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (empty($input["name"]) || empty($input["phone"])) {
    http_response_code(400);
    echo json_encode(["success"=>false,"response"=>"Name and Phone are required."]);
    exit;
}

$apiToken = "01K5K2MKGEN0G0YZMNJ77XG6Z7";

$phone = preg_replace('/\D/', '', $input["phone"]);

$comment = <<<TEXT
Location: {$input["location"]}

Service Required: {$input["projectType"]}

Budget: {$input["budget"]}

Project Details:
{$input["projectDetails"]}
TEXT;

$tags = [];
if (!empty($input["projectType"])) $tags[] = $input["projectType"];
if (!empty($input["city"])) $tags[] = $input["city"];

$state = (($input["city"] ?? "") === "Gurgaon") ? "Haryana" : "Other";

$payload = [
    "name"=>$input["name"],
    "countryCode"=>"+91",
    "phone"=>$phone,
    "email"=>$input["email"] ?? "",
    "comment"=>$comment,
    "tags"=>$tags,
    "budget"=>$input["budget"] ?? "",
    "scope"=>$input["projectType"] ?? "",
    "city"=>$input["city"] ?? "",
    "state"=>$state,
    "country"=>"India"
];

$curl = curl_init();

curl_setopt_array($curl,[
    CURLOPT_URL=>"https://extapi.dzylo.com",
    CURLOPT_POST=>true,
    CURLOPT_RETURNTRANSFER=>true,
    CURLOPT_POSTFIELDS=>json_encode($payload),
    CURLOPT_HTTPHEADER=>[
        "Content-Type: application/json",
        "Authorization: ".$apiToken
    ],
    CURLOPT_TIMEOUT=>30
]);

$response = curl_exec($curl);
$status = curl_getinfo($curl,CURLINFO_HTTP_CODE);
$error = curl_error($curl);
curl_close($curl);

if($error){
    http_response_code(500);
    echo json_encode(["success"=>false,"response"=>$error]);
    exit;
}

if($status==200){
    echo json_encode(["success"=>true,"response"=>"Lead inserted successfully."]);
    exit;
}

http_response_code($status);
echo json_encode([
    "success" => false,
    "status" => $status,
    "response" => json_decode($response, true),
    "payload" => $payload
]);
?>